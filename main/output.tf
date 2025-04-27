# S3 Bucket Outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.wyatt-datalake-35315550.bucket
}

output "step_function_arn" {
  value = aws_sfn_state_machine.step_function.arn
}

# Static Site Outputs
output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the static website"
  value       = module.static_site.bucket_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.static_site.cloudfront_distribution_id
}

output "website_url" {
  description = "URL of the static website"
  value       = module.static_site.website_url
}

# Add for visualization data bucket
output "visualization_data_bucket_name" {
  value = aws_s3_bucket.visualization_data_bucket.bucket
}