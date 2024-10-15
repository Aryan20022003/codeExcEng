const tar = require("tar-stream");
const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const stream = require("stream");

module.exports = async (job) => {
  let container = null;
  let docker = null;
  let imageName = null;

  try {
    console.log("Starting job", job.id);
    const data = job.data;
    const fileNameWithOutExtension = data.fileName.split(".")[0];

    docker = new Docker({ socketPath: "/var/run/docker.sock" });
    imageName = `sandbox_${fileNameWithOutExtension}`;

    const pack = tar.pack();
    const dockerFilePath = path.join(__dirname, `dockerFiles/Dockerfile`);
    const codeFilePath = path.join(__dirname, `..`, `uploads`, data.fileName);

    if (!fs.existsSync(dockerFilePath)) {
      throw new Error("Dockerfile not found");
    }
    if (!fs.existsSync(codeFilePath)) {
      throw new Error("Code file not found");
    }

    const dockerFile = fs.readFileSync(dockerFilePath);
    const codeFile = fs.readFileSync(codeFilePath);
    pack.entry({ name: "Dockerfile" }, dockerFile);
    pack.entry({ name: "code.cpp" }, codeFile);
    pack.finalize();

    console.log("Building Docker image...");
    const buildStream = await docker.buildImage(pack, { t: imageName });

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(buildStream, (err, res) =>
        err ? reject(err) : resolve(res)
      );
    });

    console.log("Image built successfully.");

    console.log("Creating container...");
    container = await docker.createContainer({
      Image: imageName,
      Tty: false,
      Cmd: ["./myprogram"],
      HostConfig: {
        NetworkMode: "none",
        Memory: 128 * 1024 * 1024,
        CpuPeriod: 100000,
        CpuQuota: 50000,
      },
    });

    console.log("Starting container...");
    await container.start();

    console.log("Attaching to container...");
    const logStream = new stream.PassThrough();
    // logStream.on("data", (chunk) => {
    //   console.log("Log: " + chunk.toString("utf8"));
    // });

    await container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
      },
      (err, stream) => {
        if (err) {
          console.error("Error attaching to container logs:", err);
          return;
        }
        container.modem.demuxStream(stream, logStream, logStream);
        stream.on("end", () => {
          logStream.end("!stop!");
        });
      }
    );

    let outputData = "";
    const timeoutDuration = 30000; // Increased to 30 seconds

    const executionPromise = new Promise((resolve) => {
      logStream.on("data", (chunk) => {
        const data = chunk.toString("utf8");
        if (data !== "!stop!") {
          console.log("Received output:", data);
          outputData += data;
        } else {
          console.log("Stream ended");
          resolve();
        }
      });
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Container execution timed out")),
        timeoutDuration
      );
    });

    try {
      await Promise.race([executionPromise, timeoutPromise]);
    } catch (error) {
      console.log("Timeout or error occurred:", error.message);
      console.log("Attempting to stop container...");
      try {
        await container.stop({ t: 0 }); // Force stop immediately
        console.log("Container stopped successfully.");
      } catch (stopError) {
        if (stopError.statusCode === 304) {
          console.log("Container was already stopped.");
        } else {
          console.error("Error stopping container:", stopError.message);
        }
      }
    }

    console.log("Waiting for container to finish...");
    const exitCode = await container.wait();
    console.log("Container exited with code:", exitCode.StatusCode);

    const outputsFolderPath = path.join(__dirname, "..", "outputs");
    if (!fs.existsSync(outputsFolderPath)) {
      fs.mkdirSync(outputsFolderPath);
    }

    const outputFilePath = path.join(
      outputsFolderPath,
      `${fileNameWithOutExtension}.txt`
    );

    fs.writeFileSync(outputFilePath, outputData);
    console.log("Output saved to", outputFilePath);
    console.log("Output content:", outputData);

    if (exitCode.StatusCode === 0) {
      console.log("Execution successful.");
    } else {
      console.log("Execution failed with status code:", exitCode.StatusCode);
    }

    return { success: true, output: outputData, exitCode: exitCode.StatusCode };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, error: error.message };
  } finally {
    if (container && docker) {
      console.log("Cleaning up...");
      try {
        await container.remove({ force: true });
        console.log("Container removed.");
        if (imageName) {
          await docker.getImage(imageName).remove();
          console.log("Image removed.");
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError.message);
      }
    }
    console.log("Worker done with job", job.id);
  }
};
