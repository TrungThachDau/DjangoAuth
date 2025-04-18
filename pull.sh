aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com

docker stop backend
docker stop frontend
docker stop nginx
docker rm backend
docker rm frontend
docker rm nginx
docker network create mynetwork

docker pull 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/python_django_auth:latest

docker run -d -p 8000:8000 --network mynetwork --name backend 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/python_django_auth:latest


docker pull 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/react-app:latest
docker run -d -p 5173:5173 --network mynetwork --name frontend 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/react-app:latest



docker pull 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/nginx:latest

docker run -d -p 80:80 --network mynetwork --name nginx 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/nginx:latest


