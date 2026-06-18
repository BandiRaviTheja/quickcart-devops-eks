# 1️⃣ IAM Role for EKS Control Plane

resource "aws_iam_role" "eks_cluster_role" {

  name = "${var.project_name}-eks-cluster-role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [{

      Effect    = "Allow"

      Principal = { Service = "eks.amazonaws.com" }

      Action    = "sts:AssumeRole"

    }]

  })

}



resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {

  role       = aws_iam_role.eks_cluster_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

}



resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSServicePolicy" {

  role       = aws_iam_role.eks_cluster_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"

}



# 2️⃣ EKS Cluster creation

resource "aws_eks_cluster" "eks_cluster" {

  name     = "${var.project_name}-eks"

  role_arn = aws_iam_role.eks_cluster_role.arn

  version  = "1.33"

  vpc_config {

    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  }



  depends_on = [

    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy,

    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSServicePolicy

  ]

}

data "aws_security_group" "eks_cluster_auto_sg" {

  depends_on = [aws_eks_cluster.eks_cluster]

  filter {

    name   = "tag:aws:eks:cluster-name"

    values = [aws_eks_cluster.eks_cluster.name]

  }

}

resource "aws_security_group_rule" "alb_to_eks_ports" {

  for_each = toset([for port in var.backend_ports : tostring(port)])

  

  description              = "ALB to EKS service on port ${each.value}"

  type                     = "ingress"

  from_port                = each.value

  to_port                  = each.value

  protocol                 = "tcp"

  security_group_id        = data.aws_security_group.eks_cluster_auto_sg.id

  source_security_group_id = aws_security_group.alb_sg.id

}



# 3️⃣ IAM OIDC Provider (required for IRSA)



resource "aws_iam_openid_connect_provider" "eks_oidc" {

  url             = aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer

  client_id_list  = ["sts.amazonaws.com"]

  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0afd2f8a6"]



  depends_on = [

    aws_eks_cluster.eks_cluster

  ]

}



# --------------------------

# 4️⃣ IAM Role for Fargate Pods

# --------------------------

resource "aws_iam_role" "eks_fargate_pod_role" {

  name = "${var.project_name}-eks-fargate-pod-role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [{

      Effect    = "Allow"

      Principal = { Service = "eks-fargate-pods.amazonaws.com" }

      Action    = "sts:AssumeRole"

    }]

  })

}



resource "aws_iam_role_policy_attachment" "fargate_execution_policy" {

  role       = aws_iam_role.eks_fargate_pod_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSFargatePodExecutionRolePolicy"

}



# --------------------------

# 5️⃣ IRSA ROLE FOR SERVICE ACCOUNT FOR PRODUCT POD

# --------------------------

resource "aws_iam_role" "product_pod_sa_role" {

  name = "${var.project_name}-prodcut-pod-sa-role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [{

      Effect = "Allow"

      Principal = {

        Federated = aws_iam_openid_connect_provider.eks_oidc.arn

      }

      Action = "sts:AssumeRoleWithWebIdentity"

      Condition = {

        StringEquals = {

          # Ensure this matches the serviceaccount you created in kube-system

          "${replace(aws_iam_openid_connect_provider.eks_oidc.url,"https://","")}:sub" = "system:serviceaccount:backend:product-service-account"

        }

      }

    }]

  })

}



resource "aws_iam_role_policy_attachment" "product_pod_Irsa_policy" {

  role       = aws_iam_role.product_pod_sa_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"

}





# IRSA role foe aws load balancer controller pod  service account that run in node group 

resource "aws_iam_role" "aws_load_balancer_controller_sa_role" {

  name = "${var.project_name}-aws-load-balancer-controller-sa-role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [{

      Effect = "Allow"

      Principal = {

        Federated = aws_iam_openid_connect_provider.eks_oidc.arn

      }

      Action = "sts:AssumeRoleWithWebIdentity"

      Condition = {

        StringEquals = {

          # Ensure this matches the serviceaccount you created in kube-system

          "${replace(aws_iam_openid_connect_provider.eks_oidc.url,"https://","")}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller-service-account"

        }

      }

    }]

  })

}

resource "aws_iam_role_policy_attachment" "alb_node_ElasticLoadBalancingFullAccess" {

  role  =aws_iam_role.aws_load_balancer_controller_sa_role.name

  policy_arn = "arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess"

  

}

resource "aws_iam_role_policy_attachment" "alb_node_amazonec2fullacess" {

  role  =aws_iam_role.aws_load_balancer_controller_sa_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"

  

}



# --------------------------

# 6️⃣ IAM Role for EC2 Node Group (ALB Node Group)

# --------------------------

resource "aws_iam_role" "alb_node_role" {

  name = "${var.project_name}-alb-node-role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [ {

      Effect    = "Allow"

      Principal = { Service = "ec2.amazonaws.com"}

      Action    = "sts:AssumeRole"

    } ]

  })

}



resource "aws_iam_role_policy_attachment" "alb_node_AmazonEKSWorkerNodePolicy" {

  role       = aws_iam_role.alb_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"

}



resource "aws_iam_role_policy_attachment" "alb_node_AmazonEC2ContainerRegistryReadOnly" {

  role       = aws_iam_role.alb_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"

}



resource "aws_iam_role_policy_attachment" "alb_node_AmazonEKS_CNI_Policy" {

  role       = aws_iam_role.alb_node_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"

}

# --------------------------

# 7️⃣ Fargate Profile (backend namespace)

# --------------------------

resource "aws_eks_fargate_profile" "fargate_profile" {

  cluster_name           = aws_eks_cluster.eks_cluster.name

  fargate_profile_name   = "${var.project_name}-fargate-profile"

  pod_execution_role_arn = aws_iam_role.eks_fargate_pod_role.arn

  subnet_ids             = [aws_subnet.private_1.id, aws_subnet.private_2.id]



  selector {

    namespace = "backend"

  }

}



# --------------------------

# 8️⃣ EC2 Node Group (for ALB Controller)

# --------------------------

resource "aws_eks_node_group" "alb_node_group" {

  cluster_name    = aws_eks_cluster.eks_cluster.name

  node_group_name = "${var.project_name}-alb-nodes"

  node_role_arn   = aws_iam_role.alb_node_role.arn

  subnet_ids      = [aws_subnet.private_1.id, aws_subnet.private_2.id]



  scaling_config {

    desired_size = 1

    max_size     = 2

    min_size     = 1

  }



  instance_types = ["t3.small"]



  tags = {

    Name = "${var.project_name}-alb-node"

  }



  depends_on = [

    aws_eks_cluster.eks_cluster

  ]

} 
