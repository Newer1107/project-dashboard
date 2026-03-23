"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, AreaChart, Area,
} from "recharts";
import {
  Users, FolderKanban, GraduationCap, Lightbulb, TrendingUp,
  BarChart3, Target, Award,
} from "lucide-react";

// ========== DATA ==========
const beProjects = [
  { groupId:"A1", guide:"Ms. Loukik S", domain:"Intelligent System Design and Development", sdg:3, sdgTitle:"Good Health and Well-being", title:"Early Detection of Pancreatic Cancer using AI", students:[{rollNo:22,name:"Ragini Gaggar"},{rollNo:34,name:"Vishal Gupta"},{rollNo:35,name:"Aishwarya Jadhav"}] },
  { groupId:"A3", guide:"Mrs. Veena Kulkarni", domain:"Intelligent System Design and Development", sdg:17, sdgTitle:"Partnerships for the Goals", title:"AI-Based Skill Gap Analyzer", students:[{rollNo:18,name:"Sachinandan Dash"},{rollNo:14,name:"Prajot Dabre"},{rollNo:2,name:"Anush Anchan"}] },
  { groupId:"A7", guide:"Ms. Pratiksha D", domain:"Intelligent System Design and Development", sdg:12, sdgTitle:"Responsible Consumption and Production", title:"Smart Farming Assistant: Fertilizer Prediction Based on Soil and Crop Data", students:[{rollNo:43,name:"Sanjog Karan"},{rollNo:37,name:"Vinay Jayswal"},{rollNo:60,name:"Aman Maurya"}] },
  { groupId:"A13", guide:"Mrs. Vinitta Sunish", domain:"Computing and System Design", sdg:11, sdgTitle:"Sustainable Cities and Communities", title:"Intelligent embedded system for passbox control using stm32 microcontroller", students:[{rollNo:29,name:"Mukesh Gupta"},{rollNo:30,name:"Nikhil Gupta"},{rollNo:21,name:"Dibya Jyoti Dutta"}] },
  { groupId:"A15", guide:"Mrs. Veena Kulkarni", domain:"Computing and System Design", sdg:8, sdgTitle:"Decent Work and Economic Growth", title:"Identifying Halo CME Events Based on Particle Data from Aditya-L1", students:[{rollNo:17,name:"Devanshu Dandekar"},{rollNo:19,name:"Rohan Dhiman"},{rollNo:42,name:"Rahul Kaikani"}] },
  { groupId:"A17", guide:"Mrs. Siddhi Ambre", domain:"Software Development & Information System", sdg:10, sdgTitle:"Reduced Inequalities", title:"Inclusive Connect: Bridging Accessibility for person with a disability", students:[{rollNo:65,name:"Ashley Pow"},{rollNo:66,name:"Kush Intwala"},{rollNo:68,name:"Komal Joshi"}] },
  { groupId:"A20", guide:"Ms. Hetal Rana", domain:"Computing and System Design", sdg:8, sdgTitle:"Decent Work and Economic Growth", title:"Smart IoT Assistive Cane For Public Mobility", students:[{rollNo:70,name:"Aditya Chaubey"},{rollNo:69,name:"Shivam Thakur"},{rollNo:67,name:"Yash Shah"}] },
  { groupId:"A21", guide:"Dr. Vaishali Nirgude", domain:"Intelligent System Design and Development", sdg:2, sdgTitle:"Zero Hunger", title:"AgroLens: A Novel Vision-Based System for Crop Monitoring and Weed Detection", students:[{rollNo:46,name:"Hricha Mehra"},{rollNo:51,name:"Isha Kotecha"},{rollNo:45,name:"Nisarg Kasturiwale"}] },
  { groupId:"A22", guide:"Dr. Sheetal Rathi", domain:"Intelligent System Design and Development", sdg:2, sdgTitle:"Zero Hunger", title:"KissanSanjivani : An explainable AI powered mobile app for disease Management", students:[{rollNo:50,name:"Aditya Kotian"},{rollNo:63,name:"Katkade Rugved Sanjay"},{rollNo:52,name:"Kulkarni Archis Avinash"}] },
  { groupId:"B2", guide:"Ms. Drashti S", domain:"Software Development & Information System", sdg:4, sdgTitle:"Quality Education", title:"AI-Driven Adaptive Training Platform with Digital Twin-Based Skill Gap Analysis", students:[{rollNo:13,name:"Manasvi Nayak"},{rollNo:14,name:"Pratik Neupane"},{rollNo:15,name:"Pranali Pahurkar"}] },
  { groupId:"B3", guide:"Ms. Tanmayi N", domain:"Computing and System Design", sdg:12, sdgTitle:"Responsible Consumption and Production", title:"Design Smart Alert-Based Inventory System for Reducing Supermarket Food Surplus using ML", students:[{rollNo:1,name:"Snehi Mehta"},{rollNo:11,name:"Nimesh Nakhwa"},{rollNo:30,name:"Aman Prajapati"}] },
  { groupId:"B5", guide:"Dr. R. R. Sedamkar", domain:"Software Development & Information System", sdg:4, sdgTitle:"Quality Education", title:"Design and development of AI driven Assessment Platform for Soft Skill Enhancement", students:[{rollNo:4,name:"Aditya Mishra"},{rollNo:16,name:"Harsh Pal"},{rollNo:10,name:"Pawankumar Mudaliar"}] },
  { groupId:"B6", guide:"Mr. Swapnil Bhagat", domain:"Intelligent System Design and Development", sdg:9, sdgTitle:"Industry, Innovation and Infrastructure", title:"AuthenticityNet: Deep Learning Model for Face Image Forgery Detection", students:[{rollNo:44,name:"Shivam Sati"},{rollNo:46,name:"Meet Shah"},{rollNo:38,name:"Yash Rawal"}] },
  { groupId:"B8", guide:"Mr. Swapnil Bhagat", domain:"Communication Networking and Web Engineering", sdg:9, sdgTitle:"Industry, Innovation and Infrastructure", title:"AI-Powered Cyber Threat Response System using Firewall", students:[{rollNo:25,name:"Anoop Patel"},{rollNo:29,name:"Karthik Prabhu"},{rollNo:32,name:"Harshit Prasad"}] },
  { groupId:"B13", guide:"Ms. Drashti S", domain:"Multimedia Design and Development", sdg:4, sdgTitle:"Quality Education", title:"Magic Learn - DrawInAir: Redefining Creativity, Problem Solving", students:[{rollNo:42,name:"Sudeep Sarkar"},{rollNo:41,name:"Deval Saliya"},{rollNo:26,name:"Hiya Patel"}] },
  { groupId:"B18", guide:"Dr. Rashmi Thakur", domain:"Computing and System Design", sdg:6, sdgTitle:"Clean Water and Sanitation", title:"AquaSentinel -AI powered water quality monitoring system", students:[{rollNo:2,name:"Amanteja Metla"},{rollNo:35,name:"Sahili Rane"},{rollNo:19,name:"Aditi Pandey"}] },
  { groupId:"C1", guide:"Dr. Megharani Patil", domain:"Intelligent System Design and Development", sdg:16, sdgTitle:"Peace, Justice and Strong Institutions", title:"Nayay: A Multilingual AI Framework for Scalable Legal Assistance", students:[{rollNo:9,name:"Shashank Singh"},{rollNo:10,name:"Shivanshu Singh"},{rollNo:28,name:"Pranay Tiwari"}] },
  { groupId:"C6", guide:"Ms. Loukik S", domain:"Software Development & Information System", sdg:9, sdgTitle:"Industry, Innovation and Infrastructure", title:"An Integrated Framework for Smart Waste Detection, Segregation, and Capacity Monitoring", students:[{rollNo:23,name:"Purva Tijare"},{rollNo:20,name:"Khushi Thakkar"}] },
  { groupId:"C8", guide:"Mrs. Lydia Suganya", domain:"Communication Networking and Web Engineering", sdg:16, sdgTitle:"Peace, Justice and Strong Institutions", title:"Development of a web application for simulating real time mock interviews using AI", students:[{rollNo:3,name:"Dipti Singh"},{rollNo:4,name:"Kashish Singh"},{rollNo:70,name:"Samruddhi Kamble"}] },
  { groupId:"C9", guide:"Dr. Preksha Pareek", domain:"Computing and System Design", sdg:4, sdgTitle:"Quality Education", title:"AI-enabled drone detection system", students:[{rollNo:44,name:"Abhay wadkar"},{rollNo:60,name:"Shivam Yadav"},{rollNo:46,name:"Samayak waghmare"}] },
  { groupId:"C10", guide:"Dr. Sheetal Rathi", domain:"Communication Networking and Web Engineering", sdg:15, sdgTitle:"Life on Land", title:"Animal Rescue and Adoption platform", students:[{rollNo:61,name:"Sonam Yadav"},{rollNo:17,name:"Swathi Harish"},{rollNo:54,name:"Madhu Yadav"}] },
  { groupId:"C22", guide:"Dr. Vaishali Nirgude", domain:"Computing and System Design", sdg:9, sdgTitle:"Industry, Innovation and Infrastructure", title:"UETP: Smart Equity Trading with AI and Predictive Analytics", students:[{rollNo:50,name:"Damodar Yadav"},{rollNo:49,name:"Akash Yadav"},{rollNo:52,name:"Kaushal Yadav"}] },
  { groupId:"C23", guide:"Dr. R. R. Sedamkar", domain:"Software Development & Information System", sdg:9, sdgTitle:"Industry, Innovation and Infrastructure", title:"Building a custom fuzzer to improve security of open source projects", students:[{rollNo:38,name:"Atharva Vartak"},{rollNo:22,name:"Hiral Tibrewal"},{rollNo:63,name:"Vishal Yadav"}] },
];

const rblGroups = [
  { groupId:"A1", guide:"Mr. Loukik Salvi", title:"On-device semantic segmentation of WMS services with geospatial data export", students:[{rollNo:1,name:"Deepanshu Aggarwal"},{rollNo:9,name:"Gatik Arora"},{rollNo:23,name:"Choudhary Shamim Ayub Sakko"}] },
  { groupId:"A2", guide:"Dr. R.R. Sedamkar/ Co Guide: Mrs. Siddhi Ambre", title:"IOT based Smart bottle for Healthcare", students:[{rollNo:40,name:"Khushi Dwivedi"},{rollNo:61,name:"Sakshi Gupta"}] },
  { groupId:"A3", guide:"Mr. Vikas Singh", title:"Implementation of an Alumni Association Platform for a University/Institute", students:[{rollNo:51,name:"Aayush Gupta"},{rollNo:59,name:"Ritesh Gupta"},{rollNo:68,name:"Jha Prince satan"}] },
  { groupId:"A4", guide:"Dr. Rashmi Thakur", title:"College Event Management App", students:[{rollNo:52,name:"Gupta Aman"},{rollNo:71,name:"Varun Parmar"},{rollNo:49,name:"Prem Gowda"}] },
  { groupId:"A5", guide:"Dr. Harshali Patil", title:"AI-Enhanced Internship Management Portal", students:[{rollNo:66,name:"Sonali bind"},{rollNo:67,name:"Geetanjali Ramakant Dhanwade"},{rollNo:69,name:"Shivani Sunil Kamde"}] },
  { groupId:"A6", guide:"Ms. Abhilasha Patil", title:"Multi-agent AI assistant", students:[{rollNo:25,name:"Hitansh Dedhia"},{rollNo:43,name:"Krishna Gangwal"},{rollNo:57,name:"khushi gupta"}] },
  { groupId:"A7", guide:"Dr. Vaishali Nirgude", title:"Multi-Agent AI SaaS Platform for Intelligent Workflow Management", students:[{rollNo:10,name:"Tarun Asthana"},{rollNo:53,name:"KARAN DURGESH GUPTA"},{rollNo:58,name:"Parth Gupta"}] },
  { groupId:"A8", guide:"Mrs. Akshata Raut", title:"Intelligent College Event Management System for Student Activity Credits", students:[{rollNo:20,name:"Nidhay Chavan"},{rollNo:44,name:"Gaurav Gautam"},{rollNo:48,name:"Aryan Goud"}] },
  { groupId:"A9", guide:"Dr. Megharani Patil", title:"Carbon Credit Tracking System", students:[{rollNo:50,name:"Vedika Gugale"},{rollNo:62,name:"Ayush Gusain"},{rollNo:63,name:"Hith Jodhavat"}] },
  { groupId:"A10", guide:"Dr. Sheetal Rathi/ Co Guide: Ms. Sonali Gandhi", title:"AI supported Aicte approval portal", students:[{rollNo:21,name:"Pranjal Chavan"},{rollNo:55,name:"Kashish Gupta"},{rollNo:56,name:"Khushboo Gupta"}] },
  { groupId:"A11", guide:"Dr. Harshali Patil", title:"ESPVault: Secure Password Manager for ESP8266", students:[{rollNo:13,name:"Rashi Bedse"},{rollNo:24,name:"Kruti Dagade"},{rollNo:26,name:"Gaurav Desai"}] },
  { groupId:"A12", guide:"Dr. Rekha Sharma", title:"Personalized Expense Tracker App using OCR and NLP", students:[{rollNo:4,name:"Dev Ahir"},{rollNo:17,name:"Harshit Chaube"},{rollNo:47,name:"Shawn Gonsalves"}] },
  { groupId:"A13", guide:"Mr. Ashish Dwivedi", title:"Cryptocurrency crime analysis & transaction tracking", students:[{rollNo:42,name:"Niel Gajera"},{rollNo:70,name:"Shubham mondal"}] },
  { groupId:"A14", guide:"Dr. Shailesh Sangle", title:"Emergency Response App with Location Sharing", students:[{rollNo:3,name:"Aparna Agrawal"},{rollNo:8,name:"Sana Ansari"},{rollNo:27,name:"Saniya Desai"}] },
  { groupId:"A15", guide:"Ms. Sonali Gandhi", title:"Simplifying Access to Government Digital Services", students:[{rollNo:41,name:"Sonakshi Dwivedi"},{rollNo:64,name:"Kaustubh Alshi"},{rollNo:65,name:"Ansari Asadullah Azim"}] },
  { groupId:"A16", guide:"Dr. Shailesh Sangle", title:"Energy Monitoring System for Commercial Buildings", students:[{rollNo:6,name:"Vedant Anand"},{rollNo:22,name:"Chirag Ralhan"},{rollNo:34,name:"Drivyaansh Yadav"}] },
  { groupId:"A17", guide:"Ms. Hetal Rana", title:"Visual Analytics Dashboard for Breaking Down Data Silos", students:[{rollNo:11,name:"Asmit Bagkar"},{rollNo:28,name:"Uday"},{rollNo:29,name:"Premraj Dhondphode"}] },
  { groupId:"A18", guide:"Ms. Foram Shah", title:"An Automated Diagnosis agent.", students:[{rollNo:14,name:"Shreevathsa Bhat"},{rollNo:7,name:"Jai Anjaria"},{rollNo:12,name:"Hardik Bansal"}] },
  { groupId:"A19", guide:"Mrs. Foram Shah", title:"Institute-Level Examination Management and Result Automation System", students:[{rollNo:54,name:"Karan Gupta"},{rollNo:60,name:"Rohit Gupta"},{rollNo:46,name:"Shivam Giri"}] },
  { groupId:"A20", guide:"Mr. Swapnil Bhagat", title:"Lip2Text : A system that can Lipread", students:[{rollNo:39,name:"Abhinav Dwivedi"},{rollNo:38,name:"Disha Dungrani"},{rollNo:37,name:"Pragnesh Dubey"},{rollNo:32,name:"Divesh gawkar"}] },
  { groupId:"A21", guide:"Ms. Drashti Shrimal", title:"LearnLoop : Progress driven learning platform", students:[{rollNo:31,name:"Disha Nayak"},{rollNo:18,name:"Gayathri Chauhan"},{rollNo:16,name:"Aabha Chaube"}] },
  { groupId:"A22", guide:"Ms. Foram Shah", title:"TCETian - Your CampusConnection Hub", students:[{rollNo:35,name:"Aayush Dubey"},{rollNo:36,name:"Aayush Dubey"},{rollNo:45,name:"Ritesh Gautam"}] },
  { groupId:"A23", guide:"Mr. Swapnil Bhagat", title:"Efficient Web development design for reduce processing latency & fault isolation", students:[{rollNo:5,name:"Tanish Akre"},{rollNo:15,name:"Riddam Bokdia"},{rollNo:30,name:"Dhrumi Modi"}] },
  { groupId:"A24", guide:"Mr. Ashish Dwivedi", title:"Intelligent Shared Inbox for Automated Customer Support Ticket Management", students:[{rollNo:2,name:"Kavya Aggarwal"},{rollNo:33,name:"Shivam Donda"},{rollNo:19,name:"Rajdeep Chauhan"}] },
  { groupId:"B1", guide:"Dr. Megharani Patil", title:"An Autonomous driven Infused Cognitive Marketplace with Multi-Modal for Peer-to-Peer Sharing of Books", students:[{rollNo:37,name:"Yash Pandey"},{rollNo:44,name:"Anjali Prajapati"},{rollNo:49,name:"Arpit Rai"}] },
  { groupId:"B2", guide:"Mrs. Veena Kulkarni", title:"Unified Tutor Discovery and Student Progress Tracking Platform", students:[{rollNo:51,name:"Harshit Rai"},{rollNo:58,name:"Varad Umesh Sathe"},{rollNo:61,name:"Farhan Shaikh"}] },
  { groupId:"B3", guide:"Dr. Preksha Pareek", title:"AI-Powered Criminal Identification System Using Facial Recognition", students:[{rollNo:38,name:"Sonam parmar"},{rollNo:41,name:"Mukta Prashant Phirke"},{rollNo:40,name:"Aarya Patel"}] },
  { groupId:"B4", guide:"Ms. Deepali Joshi", title:"AI-Powered Resume Screener using NLP", students:[{rollNo:50,name:"Dipeshwar kumar Rai"},{rollNo:57,name:"Atharva Sasane"},{rollNo:59,name:"Manas Sawant"}] },
  { groupId:"B5", guide:"Ms. Pratiksha Deshmukh", title:"Multilingual virtual meeting", students:[{rollNo:30,name:"Anuj Mahesh Pal"},{rollNo:33,name:"Pratik Sandeep Pandey"},{rollNo:35,name:"Saurabh Pandey"}] },
  { groupId:"B6", guide:"Dr. Rekha Sharma", title:"AI driven Mental Health Tracking using Digital Activity Patterns", students:[{rollNo:52,name:"Vivek Rai"},{rollNo:54,name:"Shreya Rajput"},{rollNo:63,name:"Shivani Niranjan Shanbhag"}] },
  { groupId:"B7", guide:"Ms. Deepali Joshi", title:"Software-Centric Vehicle CO₂ Emission Monitoring and Analysis System", students:[{rollNo:42,name:"Prabhukeluskar Akhila Nandkishor"},{rollNo:43,name:"Shivangi Pradhan"},{rollNo:48,name:"Noah Punnen"}] },
  { groupId:"B8", guide:"Dr. Megharani Patil", title:"Decentralized, Secure Community Hubs for Last-Mile Delivery", students:[{rollNo:10,name:"Vishal Kanojiya"},{rollNo:13,name:"Mohammed Zeeshan Katheem"},{rollNo:34,name:"Pandey Rahul Rakesh Kumud"}] },
  { groupId:"B9", guide:"Mr. Vikas Singh", title:"BharatLink X: AI-Powered Hyperlocal Immersive Marketplace", students:[{rollNo:5,name:"Adarsh Jha"},{rollNo:27,name:"Mourya Vishal Rampyare"},{rollNo:36,name:"Shivam Pankaj Pandey"}] },
  { groupId:"B10", guide:"Dr. Rashmi Thakur", title:"Stock market app", students:[{rollNo:46,name:"Akshat Prasad"},{rollNo:47,name:"Rishabh Praveen"},{rollNo:60,name:"Raj Uday Sawant"}] },
  { groupId:"B11", guide:"Dr. Preksha Pareek", title:"FacePay: a secure facial-recognition-based payment system", students:[{rollNo:66,name:"Prince Maurya"},{rollNo:67,name:"Urvashi Mehta"},{rollNo:70,name:"Shreya Manoj Palande"}] },
  { groupId:"B12", guide:"Dr. Preksha Pareek", title:"LeafCare: AI-Powered Plant Disease Detection", students:[{rollNo:65,name:"Aaryan Koradia"},{rollNo:68,name:"Harsh Mishra"},{rollNo:69,name:"Lalitkumar Mourya"}] },
  { groupId:"B13", guide:"Dr. Shailesh Sangle", title:"SMART-COST: A Project Cost Estimator for Software Development Teams", students:[{rollNo:6,name:"Hrishikesh Jha"},{rollNo:23,name:"Aryaman Mathur"},{rollNo:26,name:"Shlok Sanjeev Mishra"}] },
  { groupId:"B14", guide:"Ms. Mimansha Singh", title:"Smart Traffic Signal Optimization System", students:[{rollNo:4,name:"Anmol Jawalia"},{rollNo:25,name:"Aditya Mishra"},{rollNo:32,name:"Rohan Krishnakant Palav"}] },
  { groupId:"B15", guide:"Mrs. Lydia Suganya", title:"Personalized Learning Gap", students:[{rollNo:14,name:"Rumit Pravin Khabale"},{rollNo:28,name:"Nitin Sharma"},{rollNo:62,name:"Nawaz Shaikh"}] },
  { groupId:"B16", guide:"Mrs. Lydia Suganya", title:"Travel Planner", students:[{rollNo:15,name:"Sarang Kini"},{rollNo:16,name:"Shreyash Kolhe"},{rollNo:20,name:"Tanish Nilesh Macharla"}] },
  { groupId:"B17", guide:"Dr. Sheetal Rathi/ Co Guide: Ms. Akshata Raut", title:"Cre8Flow: A Digital Platform for Creator-Based Event Booking", students:[{rollNo:2,name:"Neha Jain"},{rollNo:3,name:"Somil jaiswal"},{rollNo:39,name:"Sujit Parmar"}] },
  { groupId:"B18", guide:"Mr. Vikas Singh", title:"Recyclopedia Website", students:[{rollNo:9,name:"Karan kami"},{rollNo:21,name:"Yash Sunil Mane"},{rollNo:31,name:"PAL ARYAN VIJAY BAHADUR"}] },
  { groupId:"B19", guide:"Dr. Harshali Patil", title:"AI-Powered Personalized Storytelling for Kids", students:[{rollNo:17,name:"Arpita Arvind Singh Kshatriya"},{rollNo:18,name:"Prerit kumar"},{rollNo:24,name:"Ankita Maurya"}] },
  { groupId:"B20", guide:"Dr. Vaishali Nirgude", title:"Smart Irrigation Scheduler using Weather Forecast API", students:[{rollNo:8,name:"Vivek Joshi"},{rollNo:12,name:"HarshVardhan Kashyap"},{rollNo:22,name:"Aasim Mapkar"}] },
  { groupId:"B21", guide:"Ms. Tarunima Mukherjee", title:"Yqueue: A Web-Based Queue-Less Self-Checkout System", students:[{rollNo:29,name:"Nivin reshith"},{rollNo:19,name:"Manav kumbhar"},{rollNo:55,name:"Heet R"}] },
  { groupId:"B22", guide:"Ms. Tanmayi Nagale", title:"Enterprise multi-tenant SaaS POS Application", students:[{rollNo:45,name:"Sujit Prajapati"},{rollNo:56,name:"Vibhav Salian"},{rollNo:53,name:"Sankalp Rajbhar"}] },
  { groupId:"B23", guide:"Ms. Tarunima Mukherjee", title:"Real Estate Valuation System", students:[{rollNo:1,name:"Shreya Jadhav"},{rollNo:7,name:"Jeenesh Joshi"},{rollNo:64,name:"Ashmeet Sharma"},{rollNo:11,name:"Nilakshi Kar"}] },
  { groupId:"C1", guide:"Ms. Pratiksha D", title:"AI Powered Corruption Detection System using NLP", students:[{rollNo:45,name:"Sakshi Varma"},{rollNo:46,name:"Tanvi"},{rollNo:71,name:"Yadav kumariroshani premkumar"}] },
  { groupId:"C2", guide:"Ms Deepali J", title:"Voice Based Stock Market Assistant for Retail Investors", students:[{rollNo:9,name:"Akash Singh"},{rollNo:26,name:"Kushagra Srivastava"},{rollNo:43,name:"Unnat Malik"}] },
  { groupId:"C3", guide:"Ms. Loukik S", title:"SOMA : A unified motion capture & style transfer pipeline", students:[{rollNo:7,name:"Abhinav Singh"},{rollNo:54,name:"Aryan Yadav"},{rollNo:66,name:"Chinmay Sawant"}] },
  { groupId:"C4", guide:"Mrs. Siddhi Ambre", title:"AI based drone movement monitoring & collision avoidance system", students:[{rollNo:41,name:"UJJESHA TIWARI"},{rollNo:49,name:"Snehaal Vishwakarma"},{rollNo:61,name:"Trisha Yadav"}] },
  { groupId:"C5", guide:"Dr.Rekha Sharma", title:"WealthSync: Investment tracking and ITR filing", students:[{rollNo:3,name:"Rishi Sharma"},{rollNo:16,name:"Rajveer Singh"},{rollNo:20,name:"Souvik Singh"}] },
  { groupId:"C6", guide:"Dr. Sheetal Rathi/ Co guide: Ms Hetal Rana", title:"AI powered group project companion for Students", students:[{rollNo:30,name:"Bipin Swarnkar"},{rollNo:33,name:"Tanuja Anilkumar"},{rollNo:34,name:"Teerth Lalwani"}] },
  { groupId:"C7", guide:"Ms. Loukik S", title:"AI-Enabled smart tourism platform for real time safety intelligence", students:[{rollNo:23,name:"Ojas Singwi"},{rollNo:24,name:"Sumit Sonkamble"},{rollNo:31,name:"Chinmay Dilip Takke"}] },
  { groupId:"C8", guide:"Mrs. Veena Kulkarni", title:"Smart Bed Allocation and Hospital Resource Management System", students:[{rollNo:27,name:"Sunay Bhargava"},{rollNo:69,name:"Sahil Rajesh Singh"},{rollNo:70,name:"Sangram Supalkar"}] },
  { groupId:"C9", guide:"Dr. R. R. Sedamkar/ Co guide: Ms. Siddhi Ambre", title:"AI driven Intrusion detection system for smart city", students:[{rollNo:25,name:"Soor Parmar"},{rollNo:37,name:"Adarsh Tiwari"},{rollNo:40,name:"tanushree tiwari"}] },
  { groupId:"C10", guide:"Mrs.Veena Kulkarni", title:"Adaptive Secure Communication System for Reliable Networkless Connectivity", students:[{rollNo:4,name:"Abhijeet Dilip Shelke"},{rollNo:14,name:"Om Alok Singh"},{rollNo:42,name:"Vikas Tiwari"}] },
  { groupId:"C11", guide:"Dr.Rashmi Thakur", title:"Intelligent Research Companion using GenAI", students:[{rollNo:2,name:"Ankit Sharma"},{rollNo:17,name:"Ranjan Pramod Singh"},{rollNo:22,name:"Utsav Singh"}] },
  { groupId:"C12", guide:"Dr.Vaishali Nirgude", title:"Health Management & Tracking Web App", students:[{rollNo:67,name:"Zayed Shaikh"},{rollNo:68,name:"Karan Sharma"},{rollNo:44,name:"Nitesh Varma"}] },
  { groupId:"C13", guide:"Ms. Abhilasha Patil", title:"Online learning platform with personalized path", students:[{rollNo:28,name:"Sakshi Surve"},{rollNo:39,name:"Aastha Amardeep Tiwari"},{rollNo:6,name:"Dhruv Shinde"}] },
  { groupId:"C14", guide:"Mr. Swapnil Bhagat", title:"Live Bus Tracking app", students:[{rollNo:35,name:"Kartik Thagellapally"},{rollNo:15,name:"Parmanand Singh"}] },
  { groupId:"C15", guide:"Ms. Tarunima Mukherjee", title:"Automated Social media comment analyzer for Opinion Mining", students:[{rollNo:50,name:"Abhishek Yadav"},{rollNo:52,name:"Ankit Yadav"},{rollNo:62,name:"Vishal Yadav"}] },
  { groupId:"C16", guide:"Ms. Tanmayi N", title:"An autonomous framework for self healing cloud native infrastructure", students:[{rollNo:38,name:"Arpit Tiwari"},{rollNo:36,name:"Aadarsh Tiwari"},{rollNo:60,name:"Shubh Yadav"}] },
  { groupId:"C17", guide:"Mrs. Vinitta Sunish", title:"AI-Driven Carbon Footprint Tracker and Reduction Assistant", students:[{rollNo:29,name:"Sanskar Suryawanshi"},{rollNo:13,name:"Manav Singh"},{rollNo:11,name:"Kesar Singh"}] },
  { groupId:"C18", guide:"Ms. Tanmayi N", title:"AI powered interview cheating detection system", students:[{rollNo:10,name:"Ashmit Singh"},{rollNo:21,name:"Sumit Singh"},{rollNo:19,name:"Shivam Singh"}] },
  { groupId:"C19", guide:"Mrs. Vinitta Sunish", title:"An AI-powered virtual Chartered accountant for automated financial analysis", students:[{rollNo:58,name:"Ritesh Yadav"},{rollNo:55,name:"Rajkumar Yadav"},{rollNo:56,name:"Ramkisan Yadav"}] },
  { groupId:"C20", guide:"Dr. R. R. Sedamkar/ Co guide: Ms. Siddhi Ambre", title:"Blockchain Enabled Intelligent Inventory management System for Retail Chains", students:[{rollNo:51,name:"Ankit Yadav"},{rollNo:57,name:"Reetika Yadav"},{rollNo:18,name:"Rishabh Singh"}] },
  { groupId:"C21", guide:"Ms. Pratiksha D", title:"Fake News Detection Using Hybrid ML Models", students:[{rollNo:47,name:"Manthan Vishwakarma"},{rollNo:59,name:"Rupesh Yadav"},{rollNo:64,name:"Yashwanth Pedapolu"}] },
  { groupId:"C22", guide:"Ms. Drashti S", title:"Dynamic Route Rationalization using real time data", students:[{rollNo:32,name:"Tanmay Shinde"},{rollNo:5,name:"Krish Shetty"},{rollNo:48,name:"Parth Vishwakarma"}] },
  { groupId:"C23", guide:"Ms. Drashti S", title:"A modular architecture for reducing and monitoring computational Carbon footprint of AI", students:[{rollNo:12,name:"Lakshyajeet Singh"},{rollNo:1,name:"Seher Sharik"},{rollNo:8,name:"Aditi Singh"}] },
  { groupId:"C24", guide:"Mrs.Lydia Suganya", title:"DevSpace: A domain-aware Intelligent social platform for developer centric knowledge sharing", students:[{rollNo:53,name:"Anushka Yadav"},{rollNo:63,name:"Vishal Yadav"},{rollNo:65,name:"Jaitej Singh"}] },
];

// ========== COLORS ==========
const DONUT_COLORS = ["#6366f1","#22d3ee","#f59e0b","#10b981","#f43f5e","#a855f7","#ec4899","#14b8a6"];
const AREA_GRADIENT = ["#6366f1","#22d3ee","#10b981"];

// ========== COMPONENT ==========
export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<"overview"|"be"|"rbl">("overview");

  // Computed metrics
  const metrics = useMemo(() => {
    const filteredBE = activeTab === "rbl" ? [] : beProjects;
    const filteredRBL = activeTab === "be" ? [] : rblGroups;

    const totalBE = filteredBE.length;
    const totalRBL = filteredRBL.length;
    const totalProjects = totalBE + totalRBL;
    const beStudents = filteredBE.reduce((a,p) => a + p.students.length, 0);
    const rblStudents = filteredRBL.reduce((a,p) => a + p.students.length, 0);
    const totalStudents = beStudents + rblStudents;

    const allGuides = new Set([
      ...filteredBE.map(p => p.guide),
      ...filteredRBL.map(p => p.guide),
    ]);
    const totalGuides = allGuides.size;

    const domainCounts: Record<string,number> = {};
    filteredBE.forEach(p => { domainCounts[p.domain] = (domainCounts[p.domain]||0)+1; });
    const domainData = Object.entries(domainCounts)
      .map(([name,value]) => ({ name: name.length > 25 ? name.slice(0,25)+"…" : name, fullName: name, value }))
      .sort((a,b) => b.value - a.value);

    const sdgCounts: Record<string,{sdg:number; title:string; count:number}> = {};
    filteredBE.forEach(p => {
      const key = String(p.sdg);
      if (!sdgCounts[key]) sdgCounts[key] = { sdg:p.sdg, title:p.sdgTitle, count:0 };
      sdgCounts[key].count++;
    });
    const sdgData = Object.values(sdgCounts).sort((a,b) => b.count - a.count);

    // Tech Focus Areas
    const keywordCategories: Record<string, string[]> = {
      "AI & Machine Learning": ["ai", "ml", "machine learning", "deep learning", "nlp", "computer vision", "predictive", "intelligent", "genai"],
      "IoT & Smart Systems": ["iot", "smart", "drone", "embedded", "microcontroller", "stm32", "esp8266", "hardware", "sensor"],
      "Security & Crypto": ["blockchain", "cyber", "security", "fuzzer", "crypto", "secure", "fraud", "forgery", "threat"],
      "Data & Analytics": ["data", "analytics", "tracker", "tracking", "analyzer", "monitoring", "detection"],
      "Platforms & Web Apps": ["app", "platform", "web", "portal", "dashboard", "system", "management"],
    };

    const techFocusCounts: Record<string, number> = Object.keys(keywordCategories).reduce((acc, key) => ({...acc, [key]: 0}), {});
    const allProjects = [...filteredBE, ...filteredRBL];
    
    allProjects.forEach(p => {
      const titleLower = p.title.toLowerCase();
      let matched = false;
      Object.entries(keywordCategories).forEach(([category, keywords]) => {
        if (keywords.some(kw => titleLower.includes(kw))) {
          techFocusCounts[category]++;
          matched = true;
        }
      });
      if (!matched) {
        techFocusCounts["Platforms & Web Apps"]++; // Default fallback
      }
    });

    const techFocusData = Object.entries(techFocusCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count);

    // Class-wise
    const classData = [
      { name:"BE-A", value: filteredBE.filter(p=>p.groupId.startsWith("A")).length },
      { name:"BE-B", value: filteredBE.filter(p=>p.groupId.startsWith("B")).length },
      { name:"BE-C", value: filteredBE.filter(p=>p.groupId.startsWith("C")).length },
      { name:"TE-A", value: filteredRBL.filter(p=>p.groupId.startsWith("A")).length },
      { name:"TE-B", value: filteredRBL.filter(p=>p.groupId.startsWith("B")).length },
      { name:"TE-C", value: filteredRBL.filter(p=>p.groupId.startsWith("C")).length },
    ];

    return { totalProjects, totalBE, totalRBL, totalStudents, beStudents, rblStudents, totalGuides, domainData, sdgData, techFocusData, classData };
  }, [activeTab]);

  const kpiCards = [
    { label:"Total Projects", value:metrics.totalProjects, sub:`${metrics.totalBE} Major + ${metrics.totalRBL} RBL`, icon:FolderKanban, color:"from-indigo-500 to-purple-600", change:"+100%", up:true },
    { label:"Total Students", value:metrics.totalStudents, sub:`${metrics.beStudents} BE + ${metrics.rblStudents} TE`, icon:Users, color:"from-cyan-500 to-blue-600", change:`Avg ${(metrics.totalStudents/metrics.totalProjects).toFixed(1)}/proj`, up:true },
    { label:"Faculty Guides", value:metrics.totalGuides, sub:"Across all projects", icon:GraduationCap, color:"from-emerald-500 to-teal-600", change:"Active", up:true },
    { label:"Unique Domains", value:metrics.domainData.length, sub:"BE Major Projects", icon:Lightbulb, color:"from-amber-500 to-orange-600", change:`${metrics.sdgData.length} SDGs`, up:true },
  ];

  const CustomTooltipStyle = "bg-neutral-900/95 dark:bg-neutral-800/95 backdrop-blur-xl border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl text-white text-xs";

  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay:"2s"}} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay:"4s"}} />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-40">
        <div className="bg-white/80 dark:bg-black/80 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-fit backdrop-blur-xl">
          <Image src="/tcetlogo.png" alt="TCET Logo" width={64} height={64} unoptimized className="object-contain w-10 h-10 md:w-12 md:h-12" />
        </div>
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto"><FloatingPillNavbar /></div>
        </div>
      </div>

      <ThemeToggle />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 pb-12 pt-32 space-y-8 text-neutral-800 dark:text-neutral-100">
        {/* Hero */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
                Project Analytics
              </h1>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-base md:text-lg leading-relaxed">
            Comprehensive dashboard visualizing data across Major Projects (BE) and RBL Projects (TE) — students, domains, SDG alignment, and faculty distribution.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 pt-2">
            {(["overview","be","rbl"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab===tab ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg" : "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"}`}>
                {tab==="overview"?"Overview":tab==="be"?"Major Projects":"RBL Projects"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15,duration:0.6}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => (
            <motion.div key={card.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.08,duration:0.5}}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-5 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{card.label}</p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">{card.sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" /> {card.change}
                </span>
              </div>
              {/* Decorative gradient orb */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row 1: Domain Donut + SDG Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Domain Distribution Donut */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35,duration:0.6}}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Domain Distribution</h3>
                <p className="text-xs text-neutral-500 mt-1">BE Major Projects by Domain</p>
              </div>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={metrics.domainData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                    {metrics.domainData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{background:"rgba(15,15,20,0.95)",border:"1px solid rgba(100,100,130,0.3)",borderRadius:"12px",color:"#fff",fontSize:"12px"}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {metrics.domainData.map((d,i) => (
                  <div key={d.fullName} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:DONUT_COLORS[i%DONUT_COLORS.length]}} />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate flex-1" title={d.fullName}>{d.name}</span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SDG Impact */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.6}}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">SDG Alignment</h3>
                <p className="text-xs text-neutral-500 mt-1">UN Sustainable Development Goals Coverage</p>
              </div>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metrics.sdgData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="sdg" tick={{fontSize:11,fill:"#888"}} axisLine={false} tickLine={false} label={{value:"SDG #",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}} />
                <YAxis tick={{fontSize:11,fill:"#888"}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={({active,payload}) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return <div className={CustomTooltipStyle}><p className="font-bold">SDG {d.sdg}</p><p className="text-neutral-400">{d.title}</p><p className="mt-1 text-emerald-400 font-bold">{d.count} project{d.count>1?"s":""}</p></div>;
                }} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {metrics.sdgData.map((_,i) => <Cell key={i} fill={DONUT_COLORS[i%DONUT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2: Team Size + Class Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tech Focus Areas */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Innovation Focus Areas</h3>
                <p className="text-xs text-neutral-500 mt-1">Key technologies driving student projects</p>
              </div>
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.techFocusData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
                <XAxis type="number" tick={{fontSize:11,fill:"#888"}} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={115} tick={{fontSize:11,fill:"#888"}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill:"rgba(128,128,128,0.05)"}} content={({active,payload}) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return <div className={CustomTooltipStyle}><p className="font-bold">{d.name}</p><p className="mt-1 text-amber-400 font-bold">{d.count} project{d.count>1?"s":""}</p></div>;
                }} />
                <Bar dataKey="count" radius={[0,6,6,0]}>
                  {metrics.techFocusData.map((_,i) => <Cell key={i} fill={DONUT_COLORS[i%DONUT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Class-wise Breakdown */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.55,duration:0.6}}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Class Breakdown</h3>
            <p className="text-xs text-neutral-500 mb-5">Projects per class division</p>
            <div className="space-y-4">
              {metrics.classData.map((item,i) => {
                const maxVal = Math.max(...metrics.classData.map(c=>c.value));
                const pct = (item.value/maxVal)*100;
                const color = i < 3 ? DONUT_COLORS[i] : AREA_GRADIENT[i-3];
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{item.name}</span>
                      <span className="text-sm font-black text-neutral-900 dark:text-white">{item.value}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.7+i*0.1,duration:0.8,ease:"easeOut"}} className="h-full rounded-full" style={{backgroundColor:color}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
