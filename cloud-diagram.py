from diagrams import Diagram, Cluster
from diagrams.aws.compute import EC2
from diagrams.aws.database import RDS
from diagrams.aws.devtools import Codedeploy
from diagrams.aws.network import ALB
from diagrams.aws.storage import S3
from diagrams.onprem.vcs import Github

with Diagram("Cloud Task", show=True, filename="cloud_diagram", direction="TB"):
    with Cluster("CI/CD Pipeline"):
        github = Github("GitHub Repo + Actions")
        s3 = S3("S3 (Artifacts)")
        codedeploy = Codedeploy("CodeDeploy")
        github >> s3 >> codedeploy
    with Cluster("VPC"):
        alb = ALB("Application Load Balancer")
        with Cluster("Blue Subnet"):
            blue_ec2 = EC2("Blue EC2")
        with Cluster("Green Subnet"):
            green_ec2 = EC2("Green EC2")
        redis_ec2 = EC2("Shared Redis EC2")
        db = RDS("RDS (MySQL)")

        alb >> blue_ec2
        alb >> green_ec2

        codedeploy >> blue_ec2
        codedeploy >> green_ec2

        blue_ec2 >> redis_ec2
        green_ec2 >> redis_ec2

        blue_ec2 >> db
        green_ec2 >> db