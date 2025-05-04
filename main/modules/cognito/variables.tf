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

variable "mfa_enabled" {
  description = "Whether to enable Multi-Factor Authentication as OPTIONAL"
  type        = bool
  default     = false
}

variable "lambda_triggers" {
  description = "Map of Lambda triggers for User Pool customization"
  type        = map(string)
  default     = null
}

# Identity Pool configuration variables
variable "create_identity_pool" {
  description = "Whether to create an identity pool for the Cognito User Pool"
  type        = bool
  default     = true
}

variable "main_client_name" {
  description = "Name of the main client to use for the identity pool"
  type        = string
  default     = null
}

variable "allow_unauthenticated_identities" {
  description = "Whether to allow unauthenticated identities in the identity pool"
  type        = bool
  default     = false
}

variable "authenticated_role_arn" {
  description = "ARN of the IAM role for authenticated users (if not provided, one will be created)"
  type        = string
  default     = null
}

variable "unauthenticated_role_arn" {
  description = "ARN of the IAM role for unauthenticated users (if not provided, one will be created)"
  type        = string
  default     = null
}

variable "api_gateway_arns" {
  description = "List of API Gateway ARNs that authenticated users can access"
  type        = list(string)
  default     = ["*"]
}

variable "public_api_gateway_arns" {
  description = "List of API Gateway ARNs that unauthenticated users can access"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to the Cognito User Pool"
  type        = map(string)
  default     = {}
}
