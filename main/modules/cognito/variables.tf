variable "environment" {
  description = "Deployment environment (dev, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Allowed values for environment are \"dev\" or \"prod\"."
  }
  default = "dev"
}

variable "user_pool_name" {
  description = "Name of the Cognito User Pool"
  type        = string
}

variable "domain_prefix" {
  description = "Domain prefix for the Cognito User Pool"
  type        = string
}

variable "clients" {
  description = "List of app clients for the Cognito User Pool"
  type = list(object({
    name                                 = string
    generate_secret                      = bool
    callback_urls                        = list(string)
    logout_urls                          = list(string)
    allowed_oauth_flows                  = list(string)
    allowed_oauth_scopes                 = list(string)
    allowed_oauth_flows_user_pool_client = bool
    supported_identity_providers         = list(string)
  }))
  default = []
}

variable "deletion_protection" {
  description = "Whether to enable deletion protection"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags to apply to the Cognito User Pool"
  type        = map(string)
  default     = {}
}
