terraform {
  cloud {
    organization = "wyatt-personal-aws"
    workspaces {
      tags = ["wyatt-aws-personal"]
    }
  }
}