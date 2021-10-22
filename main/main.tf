terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">=3.61.0"
    }
  }
  required_version = ">= 0.14"

  backend "remote" {
    organization = "wyatt-prod"

    workspaces {
      name = "wyatt-prod"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = remote.vpc.vpc_cidr_block
}

output "aws_region" {
  description = "The aws_region chosen"
  value       = var.aws_region
}
