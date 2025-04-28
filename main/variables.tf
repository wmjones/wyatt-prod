variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Name of the project used for tagging and naming resources"
  type        = string
}

variable "domain_name" {
  description = "Base domain name for the application (without app prefix)"
  type        = string
}

variable "app_prefix" {
  description = "Prefix for the application subdomain (default: app)"
  type        = string
  default     = "app"
}

variable "cognito_domain_prefix" {
  description = "Prefix for Cognito hosted UI domain"
  type        = string
}
