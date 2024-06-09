output "s3_bucket_name" {
  value = aws_s3_bucket.step_function_bucket-1.bucket
}

output "step_function_arn" {
  value = aws_sfn_state_machine.step_function.arn
}
