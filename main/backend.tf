terraform {
  cloud {
    organization = "wyatt-personal-aws"
    
    workspaces {
      tags = ["visualizer-app"]
    }
  }
}