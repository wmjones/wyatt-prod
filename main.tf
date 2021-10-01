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
  region = "us-east-2"
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}