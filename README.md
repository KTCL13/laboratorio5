# laboratorio5

    docker-compose up -d

To see the containers:

    docker ps

To enter in Kafka (server-kafka-1 is the name of the container):

    sudo docker exec -it server-kafka-1 /bin/bash

Create a new topic:

    kafka-topics --create --topic user-location-updates --bootstrap-server localhost:9092

List the topics:

    kafka-topics --list --bootstrap-server localhost:9092

See messages:

    kafka-console-consumer --bootstrap-server localhost:9092 --topic user-location-updates -from-beginning
        kafka-console-consumer --bootstrap-server localhost:9092 --topic movies -from-beginning

Add message 

    kafka-console-producer --broker-list localhost:9092 --topic user-location-updates
    {"value": "test"}