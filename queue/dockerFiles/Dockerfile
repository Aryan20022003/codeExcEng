FROM ubuntu:latest
WORKDIR /app
RUN apt-get update && apt-get install -y g++ make
COPY code.cpp /app/code.cpp
RUN g++ -o myprogram /app/code.cpp
CMD ["./myprogram"]