# variables.tf - FIXED VERSION
variable "aws_region" {
  description = "aws_region"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "project name prefix"
  type        = string
  default     = "devops-project"
}

variable "vpc_cidr" {
  description = "vpc cidr block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  type    = string
  default = "10.0.2.0/24"
}

variable "private_subnet_1_cidr" {
  type    = string
  default = "10.0.3.0/24"
}

variable "private_subnet_2_cidr" {
  type    = string
  default = "10.0.4.0/24"
}

variable "backend_ports" {
  description = "backend service ports"
  type        = list(number)
  default     = [5001, 5002, 5003, 5004, 5005, 5006]
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "db_allocated_storage" {
  type    = number
  default = 20
}

variable "db_user" {
  type    = string
  default = "postgres"
}

variable "db_password" {
  type    = string
  default = "12345678"
}