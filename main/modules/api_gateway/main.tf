variable "domain_name" {
  description = "Fully‑qualified custom domain name for the API (e.g., api.example.com). Leave blank when create_custom_domain is false."
  type        = string
  default     = ""
}

variable "create_custom_domain" {
  description = "Set to true to provision an API Gateway custom domain. Requires domain_name and certificate_arn."
  type        = bool
  default     = false

  validation {
    condition     = !var.create_custom_domain || (var.domain_name != "" && var.certificate_arn != "")
    error_message = "When create_custom_domain is true, both domain_name and certificate_arn must be provided."
  }
}

variable "certificate_arn" {
  description = "ACM certificate ARN to use with the custom domain."
  type        = string
  default     = ""
}
