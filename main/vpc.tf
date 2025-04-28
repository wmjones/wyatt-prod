module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "wyatt-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-2a"]
  private_subnets = ["10.0.1.0/24"]
  public_subnets  = ["10.0.101.0/24"]

  enable_ipv6        = false
  enable_nat_gateway = false
  single_nat_gateway = true
}
