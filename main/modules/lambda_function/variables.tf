variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "description" {
  description = "Description of the Lambda function"
  type        = string
  default     = ""
}

variable "handler" {
  description = "Lambda function handler"
  type        = string
}

variable "runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "python3.12"
}

variable "zip_file" {
  description = "Path to the zip file containing the Lambda code"
  type        = string
}

variable "timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 10
}

variable "memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 128
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "policy_statements" {
  description = "IAM policy statements for the Lambda function"
  type = map(object({
    effect    = string
    actions   = list(string)
    resources = list(string)
  }))
  default = {}
}

variable "tags" {
  description = "Tags to apply to the Lambda function"
  type        = map(string)
  default     = {}
}

variable "create_log_group" {
  description = "Whether to create a new CloudWatch Logs log group (set to false if log group already exists)"
  type        = bool
  default     = false
}

variable "log_retention_days" {
  description = "Retention period in days for CloudWatch Logs log group (if created)"
  type        = number
  default     = 14
}
