output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

output "private_subnets" {
  value = [aws_subnet.private_1.id, aws_subnet.private_2.id]
}
output "rds_sg_id" {
  value = aws_security_group.RDS_sg.id
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}

output "frontend_url" {
  value = aws_s3_bucket_website_configuration.static.website_endpoint
}

output "eks_cluster_name" {
  value = aws_eks_cluster.eks_cluster.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.eks_cluster.endpoint
}
output "alb_sg_id" {
  value = aws_security_group.alb_sg.id
}
