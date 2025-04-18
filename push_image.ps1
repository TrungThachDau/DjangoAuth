aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com


docker buildx build --platform linux/amd64,linux/arm64 -t 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/python_django_auth:latest --push .

cd .\auth-react-app\

docker buildx build --platform linux/amd64,linux/arm64 -t 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/react-app:latest --push .

cd ..
cd .\nginx

docker buildx build --platform linux/amd64,linux/arm64 -t 990640380179.dkr.ecr.ap-southeast-1.amazonaws.com/android17x/nginx:latest --push .

