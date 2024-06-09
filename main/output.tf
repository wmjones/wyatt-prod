output "s3_bucket_name" {
  value = aws_s3_bucket.data.bucket
}

output "step_function_arn" {
  value = aws_sfn_state_machine.step_function.arn
}