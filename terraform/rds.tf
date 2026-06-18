# rds.tf - UPDATED VERSION (Public RDS)
resource "aws_db_subnet_group" "rds_subnet" {
    name       = "${var.project_name}-subnet-group"
    subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]  # Using PUBLIC subnets
    tags = {
        Name = "${var.project_name}-rds-subnet-group"
    }
}

resource "aws_db_instance" "postgres" {
    identifier              = "${var.project_name}-db"
    engine                  = "postgres"
    engine_version          = "16.10"
    instance_class          = var.db_instance_class
    allocated_storage       = var.db_allocated_storage
    storage_type            = "gp3"
    username                = var.db_user
    password                = var.db_password
    db_subnet_group_name    = aws_db_subnet_group.rds_subnet.name
    vpc_security_group_ids  = [aws_security_group.RDS_sg.id]
    publicly_accessible     = true  # Set to true for public access
    multi_az                = false
    skip_final_snapshot     = true
    deletion_protection     = false
    
    tags = {
        Name = "${var.project_name}-rds"
    }
}
