module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "wyatt-vpc"
  cidr = "10.0.0.0/26"

  azs             = ["us-east-2a"]
  private_subnets = ["10.0.0.192/26"]
  public_subnets  = ["10.0.0.128/26"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

}
