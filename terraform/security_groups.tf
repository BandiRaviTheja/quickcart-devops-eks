# ALB Security Group
resource "aws_security_group" "alb_sg" {
    name        = "${var.project_name}-alb-sg"
    description = "allow HTTP/HTTPS"
    vpc_id      = aws_vpc.main.id
    
    ingress {
        description = "HTTP from anywhere"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    ingress {
        description = "HTTPS from anywhere"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    tags = {
        Name = "${var.project_name}-alb-sg"
    }
}

# RDS Postgres Security Group - UPDATED for Public Access
resource "aws_security_group" "RDS_sg" {
    name        = "${var.project_name}-RDS-sg"
    description = "allow eks and public internet access to RDS"
    vpc_id      = aws_vpc.main.id
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    tags = {
        Name = "${var.project_name}-RDS-sg"
    }
}
# ----------------------------
# Allow access from EKS Cluster SG
# ----------------------------
resource "aws_security_group_rule" "rds_from_cluster" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = data.aws_security_group.eks_cluster_auto_sg.id
  security_group_id        = aws_security_group.RDS_sg.id
  description              = "Allow EKS cluster control plane access"
}
