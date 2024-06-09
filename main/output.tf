output "s3_bucket_name" {
  value = aws_s3_bucket.wyatt-step-function-bucket-1.bucket
}

output "step_function_arn" {
  value = aws_sfn_state_machine.step_function.arn
}
