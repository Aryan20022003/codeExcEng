// Description: This is a sample sandbox process file that will be executed by the queue worker.
//data=job.data ->{uploadAddress,fileName,uploadId,extension,codeUrl}

//objectives of this file -> 1. download the file , 2. create docker container, 3. run the code in the container , 4. write a file  5. update the db with the result

module.exports = async (job) => {
  // Do something with job
  const data = job.data;
  console.log(job.id, job.name, job.data);
  return 1;
};
