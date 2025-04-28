variable "bucket_name" {
  description = "Name of the S3 bucket for static website hosting"
  type        = string
}

variable "domain_name" {
  description = "Base domain name for the application (without app prefix)"
  type        = string
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "create_dns_records" {
  description = "Whether to create DNS records for certificate validation and CloudFront alias"
  type        = bool
  default     = false
}

variable "use_default_cert" {
  description = "Use CloudFront default certificate instead of ACM certificate"
  type        = bool
  default     = false
}