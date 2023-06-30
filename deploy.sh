 npm run build

 aws s3 sync ./build/ s3://frontend-reeva-web --exact-timestamps --delete --exact-timestamps

 aws cloudfront create-invalidation --distribution-id E26BK5ZJUCKKDL --paths "/*"