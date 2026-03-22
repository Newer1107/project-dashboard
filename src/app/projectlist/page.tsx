"use client";

import React from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";

const rblGroups = [
  // ================= TE A =================
  {
    groupId: "A1",
    guide: "Mr. Loukik Salvi",
    title:
      "On-device semantic segmentation of WMS services with geospatial data export",
    students: [
      { rollNo: 1, name: "Deepanshu Aggarwal" },
      { rollNo: 9, name: "Gatik Arora" },
      { rollNo: 23, name: "Choudhary Shamim Ayub Sakko" },
    ],
  },
  {
    groupId: "A2",
    guide: "Dr. R.R. Sedamkar/ Co Guide: Mrs. Siddhi Ambre",
    title: "IOT based Smart bottle for Healthcare",
    students: [
      { rollNo: 40, name: "Khushi Dwivedi" },
      { rollNo: 61, name: "Sakshi Gupta" },
    ],
  },
  {
    groupId: "A3",
    guide: "Mr. Vikas Singh",
    title:
      "Implementation of an Alumni Association Platform for a University/Institute",
    students: [
      { rollNo: 51, name: "Aayush Gupta" },
      { rollNo: 59, name: "Ritesh Gupta" },
      { rollNo: 68, name: "Jha Prince satan" },
    ],
  },
  {
    groupId: "A4",
    guide: "Dr. Rashmi Thakur",
    title:
      "College Event Management App – Event registration, scheduling, notifications",
    students: [
      { rollNo: 52, name: "Gupta Aman" },
      { rollNo: 71, name: "Varun Parmar" },
      { rollNo: 49, name: "Prem Gowda" },
    ],
  },
  {
    groupId: "A5",
    guide: "Dr. Harshali Patil",
    title: "AI-Enhanced Internship Management Portal",
    students: [
      { rollNo: 66, name: "Sonali bind" },
      { rollNo: 67, name: "Geetanjali Ramakant Dhanwade" },
      { rollNo: 69, name: "Shivani Sunil Kamde" },
    ],
  },
  {
    groupId: "A6",
    guide: "Ms. Abhilasha Patil",
    title:
      "A combination of 2-3 multiagents which can serve as an assistant and another agent using AI",
    students: [
      { rollNo: 25, name: "Hitansh Dedhia" },
      { rollNo: 43, name: "Krishna Gangwal" },
      { rollNo: 57, name: "khushi gupta" },
    ],
  },
  {
    groupId: "A7",
    guide: "Dr. Vaishali Nirgude",
    title:
      "Multi-Agent AI SaaS Platform for Intelligent Workflow Management with Full-Stack Development and Immersive AR/VR Experience",
    students: [
      { rollNo: 10, name: "Tarun Asthana" },
      { rollNo: 53, name: "KARAN DURGESH GUPTA" },
      { rollNo: 58, name: "Parth Gupta" },
    ],
  },
  {
    groupId: "A8",
    guide: "Mrs. Akshata Raut",
    title:
      "Intelligent College Event Management System for Student Activity Credits",
    students: [
      { rollNo: 20, name: "Nidhay Chavan" },
      { rollNo: 44, name: "Gaurav Gautam" },
      { rollNo: 48, name: "Aryan Goud" },
    ],
  },
  {
    groupId: "A9",
    guide: "Dr. Megharani Patil",
    title: "Carbon Credit Tracking System",
    students: [
      { rollNo: 50, name: "Vedika Gugale" },
      { rollNo: 62, name: "Ayush Gusain" },
      { rollNo: 63, name: "Hith Jodhavat" },
    ],
  },
  {
    groupId: "A10",
    guide: "Dr. Sheetal Rathi/ Co Guide: Ms. Sonali Gandhi",
    title: "AI supported Aicte approval portal",
    students: [
      { rollNo: 21, name: "Pranjal Chavan" },
      { rollNo: 55, name: "Kashish Gupta" },
      { rollNo: 56, name: "Khushboo Gupta" },
    ],
  },
  {
    groupId: "A11",
    guide: "Dr. Harshali Patil",
    title: "ESPVault: Secure Password Manager for ESP8266",
    students: [
      { rollNo: 13, name: "Rashi Bedse" },
      { rollNo: 24, name: "Kruti Dagade" },
      { rollNo: 26, name: "Gaurav Desai" },
    ],
  },
  {
    groupId: "A12",
    guide: "Dr. Rekha Sharma",
    title: "Personalized Expense Tracker App using OCR and NLP",
    students: [
      { rollNo: 4, name: "Dev Ahir" },
      { rollNo: 17, name: "Harshit Chaube" },
      { rollNo: 47, name: "Shawn Gonsalves" },
    ],
  },
  {
    groupId: "A13",
    guide: "Mr. Ashish Dwivedi",
    title: "Cryptocurrency crime analysis & transaction tracking",
    students: [
      { rollNo: 42, name: "Niel Gajera" },
      { rollNo: 70, name: "Shubham mondal" },
    ],
  },
  {
    groupId: "A14",
    guide: "Dr. Shailesh Sangle",
    title: "Emergency Response App with Location Sharing",
    students: [
      { rollNo: 3, name: "Aparna Agrawal" },
      { rollNo: 8, name: "Sana Ansari" },
      { rollNo: 27, name: "Saniya Desai" },
    ],
  },
  {
    groupId: "A15",
    guide: "Ms. Sonali Gandhi",
    title: "Simplifying Access to Government Digital Services",
    students: [
      { rollNo: 41, name: "Sonakshi Dwivedi" },
      { rollNo: 64, name: "Kaustubh Alshi" },
      { rollNo: 65, name: "Ansari Asadullah Azim" },
    ],
  },
  {
    groupId: "A16",
    guide: "Dr. Shailesh Sangle",
    title: "Energy Monitoring System for Commercial Buildings",
    students: [
      { rollNo: 6, name: "Vedant Anand" },
      { rollNo: 22, name: "Chirag Ralhan" },
      { rollNo: 34, name: "Drivyaansh Yadav" },
    ],
  },
  {
    groupId: "A17",
    guide: "Ms. Hetal Rana",
    title: "Visual Analytics Dashboard for Breaking Down Data Silos",
    students: [
      { rollNo: 11, name: "Asmit Bagkar" },
      { rollNo: 28, name: "Uday" },
      { rollNo: 29, name: "Premraj Dhondphode" },
    ],
  },
  {
    groupId: "A18",
    guide: "Ms. Foram Shah",
    title: "An Automated Diagnosis agent.",
    students: [
      { rollNo: 14, name: "Shreevathsa Bhat" },
      { rollNo: 7, name: "Jai Anjaria" },
      { rollNo: 12, name: "Hardik Bansal" },
    ],
  },
  {
    groupId: "A19",
    guide: "Mrs. Foram Shah",
    title:
      "Institute-Level Examination Management and Result Automation System",
    students: [
      { rollNo: 54, name: "Karan Gupta" },
      { rollNo: 60, name: "Rohit Gupta" },
      { rollNo: 46, name: "Shivam Giri" },
    ],
  },
  {
    groupId: "A20",
    guide: "Mr. Swapnil Bhagat",
    title: "Lip2Text : A system that can Lipread",
    students: [
      { rollNo: 39, name: "Abhinav Dwivedi" },
      { rollNo: 38, name: "Disha Dungrani" },
      { rollNo: 37, name: "Pragnesh Dubey" },
      { rollNo: 32, name: "Divesh gawkar" },
    ],
  },
  {
    groupId: "A21",
    guide: "Ms. Drashti Shrimal",
    title: "LearnLoop : Progress driven learning platform",
    students: [
      { rollNo: 31, name: "Disha Nayak" },
      { rollNo: 18, name: "Gayathri Chauhan" },
      { rollNo: 16, name: "Aabha Chaube" },
    ],
  },
  {
    groupId: "A22",
    guide: "Ms. Foram Shah",
    title: "TCETian - Your CampusConnection Hub",
    students: [
      { rollNo: 35, name: "Aayush Dubey" },
      { rollNo: 36, name: "Aayush Dubey" },
      { rollNo: 45, name: "Ritesh Gautam" },
    ],
  },
  {
    groupId: "A23",
    guide: "Mr. Swapnil Bhagat",
    title:
      "Efficient Web development design for reduce processing latency & fault isolation",
    students: [
      { rollNo: 5, name: "Tanish Akre" },
      { rollNo: 15, name: "Riddam Bokdia" },
      { rollNo: 30, name: "Dhrumi Modi" },
    ],
  },
  {
    groupId: "A24",
    guide: "Mr. Ashish Dwivedi",
    title:
      "Intelligent Shared Inbox for Automated Customer Support Ticket Management",
    students: [
      { rollNo: 2, name: "Kavya Aggarwal" },
      { rollNo: 33, name: "Shivam Donda" },
      { rollNo: 19, name: "Rajdeep Chauhan" },
    ],
  },

  // ================= TE B =================
  {
    groupId: "B1",
    guide: "Dr. Megharani Patil",
    title:
      "An Autonomous driven Infused Cognitive Marketplace with Multi - Modal for Peer-to-Peer Sharing of Books",
    students: [
      { rollNo: 37, name: "Yash Pandey" },
      { rollNo: 44, name: "Anjali Prajapati" },
      { rollNo: 49, name: "Arpit Rai" },
    ],
  },
  {
    groupId: "B2",
    guide: "Mrs. Veena Kulkarni",
    title: "Unified Tutor Discovery and Student Progress Tracking Platform",
    students: [
      { rollNo: 51, name: "Harshit Rai" },
      { rollNo: 58, name: "Varad Umesh Sathe" },
      { rollNo: 61, name: "Farhan Shaikh" },
    ],
  },
  {
    groupId: "B3",
    guide: "Dr. Preksha Pareek",
    title: "AI-Powered Criminal Identification System Using Facial Recognition",
    students: [
      { rollNo: 38, name: "Sonam parmar" },
      { rollNo: 41, name: "Mukta Prashant Phirke" },
      { rollNo: 40, name: "Aarya Patel" },
    ],
  },
  {
    groupId: "B4",
    guide: "Ms. Deepali Joshi",
    title:
      "AI-Powered Resume Screener – A system that shortlists candidates using NLP",
    students: [
      { rollNo: 50, name: "Dipeshwar kumar Rai" },
      { rollNo: 57, name: "Atharva Sasane" },
      { rollNo: 59, name: "Manas Sawant" },
    ],
  },
  {
    groupId: "B5",
    guide: "Ms. Pratiksha Deshmukh",
    title: "Multilingual virtual meeting",
    students: [
      { rollNo: 30, name: "Anuj Mahesh Pal" },
      { rollNo: 33, name: "Pratik Sandeep Pandey" },
      { rollNo: 35, name: "Saurabh Pandey" },
    ],
  },
  {
    groupId: "B6",
    guide: "Dr. Rekha Sharma",
    title: "AI driven Mental Health Tracking using Digital Activity Patterns",
    students: [
      { rollNo: 52, name: "Vivek Rai" },
      { rollNo: 54, name: "Shreya Rajput" },
      { rollNo: 63, name: "Shivani Niranjan Shanbhag" },
    ],
  },
  {
    groupId: "B7",
    guide: "Ms. Deepali Joshi",
    title:
      "Software-Centric Vehicle CO₂ Emission Monitoring and Analysis System",
    students: [
      { rollNo: 42, name: "Prabhukeluskar Akhila Nandkishor" },
      { rollNo: 43, name: "Shivangi Pradhan" },
      { rollNo: 48, name: "Noah Punnen" },
    ],
  },
  {
    groupId: "B8",
    guide: "Dr. Megharani Patil",
    title: "Decentralized, Secure Community Hubs for Last-Mile Delivery",
    students: [
      { rollNo: 10, name: "Vishal Kanojiya" },
      { rollNo: 13, name: "Mohammed Zeeshan Katheem" },
      { rollNo: 34, name: "Pandey Rahul Rakesh Kumud" },
    ],
  },
  {
    groupId: "B9",
    guide: "Mr. Vikas Singh",
    title:
      "BharatLink X: AI-Powered Hyperlocal Immersive Marketplace & Custom Product Creator",
    students: [
      { rollNo: 5, name: "Adarsh Jha" },
      { rollNo: 27, name: "Mourya Vishal Rampyare" },
      { rollNo: 36, name: "Shivam Pankaj Pandey" },
    ],
  },
  {
    groupId: "B10",
    guide: "Dr. Rashmi Thakur",
    title: "Stock market app",
    students: [
      { rollNo: 46, name: "Akshat Prasad" },
      { rollNo: 47, name: "Rishabh Praveen" },
      { rollNo: 60, name: "Raj Uday Sawant" },
    ],
  },
  {
    groupId: "B11",
    guide: "Dr. Preksha Pareek",
    title: "FacePay: a secure facial-recognition-based payment system",
    students: [
      { rollNo: 66, name: "Prince Maurya" },
      { rollNo: 67, name: "Urvashi Mehta" },
      { rollNo: 70, name: "Shreya Manoj Palande" },
    ],
  },
  {
    groupId: "B12",
    guide: "Dr. Preksha Pareek",
    title:
      "LeafCare: AI-Powered Plant Disease Detection and Treatment Assistance",
    students: [
      { rollNo: 65, name: "Aaryan Koradia" },
      { rollNo: 68, name: "Harsh Mishra" },
      { rollNo: 69, name: "Lalitkumar Mourya" },
    ],
  },
  {
    groupId: "B13",
    guide: "Dr. Shailesh Sangle",
    title:
      "SMART-COST: A Project Cost Estimator for Software Development Teams",
    students: [
      { rollNo: 6, name: "Hrishikesh Jha" },
      { rollNo: 23, name: "Aryaman Mathur" },
      { rollNo: 26, name: "Shlok Sanjeev Mishra" },
    ],
  },
  {
    groupId: "B14",
    guide: "Ms. Mimansha Singh",
    title: "Smart Traffic Signal Optimization System",
    students: [
      { rollNo: 4, name: "Anmol Jawalia" },
      { rollNo: 25, name: "Aditya Mishra" },
      { rollNo: 32, name: "Rohan Krishnakant Palav" },
    ],
  },
  {
    groupId: "B15",
    guide: "Mrs. Lydia Suganya",
    title: "Personalized Learning Gap",
    students: [
      { rollNo: 14, name: "Rumit Pravin Khabale" },
      { rollNo: 28, name: "Nitin Sharma" },
      { rollNo: 62, name: "Nawaz Shaikh" },
    ],
  },
  {
    groupId: "B16",
    guide: "Mrs. Lydia Suganya",
    title: "Travel Planner",
    students: [
      { rollNo: 15, name: "Sarang Kini" },
      { rollNo: 16, name: "Shreyash Kolhe" },
      { rollNo: 20, name: "Tanish Nilesh Macharla" },
    ],
  },
  {
    groupId: "B17",
    guide: "Dr. Sheetal Rathi/ Co Guide: Ms. Akshata Raut",
    title: "Cre8Flow: A Digital Platform for Creator-Based Event Booking",
    students: [
      { rollNo: 2, name: "Neha Jain" },
      { rollNo: 3, name: "Somil jaiswal" },
      { rollNo: 39, name: "Sujit Parmar" },
    ],
  },
  {
    groupId: "B18",
    guide: "Mr. Vikas Singh",
    title: "Recyclopedia Website",
    students: [
      { rollNo: 9, name: "Karan kami" },
      { rollNo: 21, name: "Yash Sunil Mane" },
      { rollNo: 31, name: "PAL ARYAN VIJAY BAHADUR" },
    ],
  },
  {
    groupId: "B19",
    guide: "Dr. Harshali Patil",
    title: "AI-Powered Personalized Storytelling for Kids",
    students: [
      { rollNo: 17, name: "Arpita Arvind Singh Kshatriya" },
      { rollNo: 18, name: "Prerit kumar" },
      { rollNo: 24, name: "Ankita Maurya" },
    ],
  },
  {
    groupId: "B20",
    guide: "Dr. Vaishali Nirgude",
    title: "Smart Irrigation Scheduler using Weather Forecast API",
    students: [
      { rollNo: 8, name: "Vivek Joshi" },
      { rollNo: 12, name: "HarshVardhan Kashyap" },
      { rollNo: 22, name: "Aasim Mapkar" },
    ],
  },
  {
    groupId: "B21",
    guide: "Ms. Tarunima Mukherjee",
    title: "Yqueue: A Web-Based Queue-Less Self-Checkout System",
    students: [
      { rollNo: 29, name: "Nivin reshith" },
      { rollNo: 19, name: "Manav kumbhar" },
      { rollNo: 55, name: "Heet R" },
    ],
  },
  {
    groupId: "B22",
    guide: "Ms. Tanmayi Nagale",
    title: "Enterprise multi-tenant SaaS POS Application",
    students: [
      { rollNo: 45, name: "Sujit Prajapati" },
      { rollNo: 56, name: "Vibhav Salian" },
      { rollNo: 53, name: "Sankalp Rajbhar" },
    ],
  },
  {
    groupId: "B23",
    guide: "Ms. Tarunima Mukherjee",
    title: "Real Estate Valuation System",
    students: [
      { rollNo: 1, name: "Shreya Jadhav" },
      { rollNo: 7, name: "Jeenesh Joshi" },
      { rollNo: 64, name: "Ashmeet Sharma" },
      { rollNo: 11, name: "Nilakshi Kar" },
    ],
  },

  // ================= TE C =================
  {
    groupId: "C1",
    guide: "Ms. Pratiksha D",
    title: "AI Powered Corruption Detection System using NLP",
    students: [
      { rollNo: 45, name: "Sakshi Varma" },
      { rollNo: 46, name: "Tanvi" },
      { rollNo: 71, name: "Yadav kumariroshani premkumar" },
    ],
  },
  {
    groupId: "C2",
    guide: "Ms Deepali J",
    title: "Voice Based Stock Market Assistant for Retail Investors",
    students: [
      { rollNo: 9, name: "Akash Singh" },
      { rollNo: 26, name: "Kushagra Srivastava" },
      { rollNo: 43, name: "Unnat Malik" },
    ],
  },
  {
    groupId: "C3",
    guide: "Ms. Loukik S",
    title: "SOMA : A unified motion capture & style transfer pipeline",
    students: [
      { rollNo: 7, name: "Abhinav Singh" },
      { rollNo: 54, name: "Aryan Yadav" },
      { rollNo: 66, name: "Chinmay Sawant" },
    ],
  },
  {
    groupId: "C4",
    guide: "Mrs. Siddhi Ambre",
    title: "AI based drone movement monitoring & collision avoidance system",
    students: [
      { rollNo: 41, name: "UJJESHA TIWARI" },
      { rollNo: 49, name: "Snehaal Vishwakarma" },
      { rollNo: 61, name: "Trisha Yadav" },
    ],
  },
  {
    groupId: "C5",
    guide: "Dr.Rekha Sharma",
    title:
      "WealthSync: A portal for collectively tracking and assessing various user investments and consecutively filing the ITR",
    students: [
      { rollNo: 3, name: "Rishi Sharma" },
      { rollNo: 16, name: "Rajveer Singh" },
      { rollNo: 20, name: "Souvik Singh" },
    ],
  },
  {
    groupId: "C6",
    guide: "Dr. Sheetal Rathi/ Co guide: Ms Hetal Rana",
    title: "AI powered group project companion for Students",
    students: [
      { rollNo: 30, name: "Bipin Swarnkar" },
      { rollNo: 33, name: "Tanuja Anilkumar" },
      { rollNo: 34, name: "Teerth Lalwani" },
    ],
  },
  {
    groupId: "C7",
    guide: "Ms. Loukik S",
    title:
      "An AI-Enabled smart tourism platform for real time safety intelligence Geo fencing and content aware cultural assistance",
    students: [
      { rollNo: 23, name: "Ojas Singwi" },
      { rollNo: 24, name: "Sumit Sonkamble" },
      { rollNo: 31, name: "Chinmay Dilip Takke" },
    ],
  },
  {
    groupId: "C8",
    guide: "Mrs. Veena Kulkarni",
    title: "Smart Bed Allocation and Hospital Resource Management System",
    students: [
      { rollNo: 27, name: "Sunay Bhargava" },
      { rollNo: 69, name: "Sahil Rajesh Singh" },
      { rollNo: 70, name: "Sangram Supalkar" },
    ],
  },
  {
    groupId: "C9",
    guide: "Dr. R. R. Sedamkar/ Co guide: Ms. Siddhi Ambre",
    title: "AI driven Intrusion detection system for smart city",
    students: [
      { rollNo: 25, name: "Soor Parmar" },
      { rollNo: 37, name: "Adarsh Tiwari" },
      { rollNo: 40, name: "tanushree tiwari" },
    ],
  },
  {
    groupId: "C10",
    guide: "Mrs.Veena Kulkarni",
    title:
      "Adaptive Secure Communication System for Reliable Networkless Connectivity",
    students: [
      { rollNo: 4, name: "Abhijeet Dilip Shelke" },
      { rollNo: 14, name: "Om Alok Singh" },
      { rollNo: 42, name: "Vikas Tiwari" },
    ],
  },
  {
    groupId: "C11",
    guide: "Dr.Rashmi Thakur",
    title: "Intelligent Research Companion using GenAI",
    students: [
      { rollNo: 2, name: "Ankit Sharma" },
      { rollNo: 17, name: "Ranjan Pramod Singh" },
      { rollNo: 22, name: "Utsav Singh" },
    ],
  },
  {
    groupId: "C12",
    guide: "Dr.Vaishali Nirgude",
    title: "Health Management & Tracking Web App",
    students: [
      { rollNo: 67, name: "Zayed Shaikh" },
      { rollNo: 68, name: "Karan Sharma" },
      { rollNo: 44, name: "Nitesh Varma" },
    ],
  },
  {
    groupId: "C13",
    guide: "Ms. Abhilasha Patil",
    title: "Online learning platform with personalized path",
    students: [
      { rollNo: 28, name: "Sakshi Surve" },
      { rollNo: 39, name: "Aastha Amardeep Tiwari" },
      { rollNo: 6, name: "Dhruv Shinde" },
    ],
  },
  {
    groupId: "C14",
    guide: "Mr. Swapnil Bhagat",
    title: "Live Bus Tracking app",
    students: [
      { rollNo: 35, name: "Kartik Thagellapally" },
      { rollNo: 15, name: "Parmanand Singh" },
    ],
  },
  {
    groupId: "C15",
    guide: "Ms. Tarunima Mukherjee",
    title: "Automated Social media comment analyzer for Openion Mining",
    students: [
      { rollNo: 50, name: "Abhishek Yadav" },
      { rollNo: 52, name: "Ankit Yadav" },
      { rollNo: 62, name: "Vishal Yadav" },
    ],
  },
  {
    groupId: "C16",
    guide: "Ms. Tanmayi N",
    title:
      "An autonomous framework for self healing cloud native infrastructure",
    students: [
      { rollNo: 38, name: "Arpit Tiwari" },
      { rollNo: 36, name: "Aadarsh Tiwari" },
      { rollNo: 60, name: "Shubh Yadav" },
    ],
  },
  {
    groupId: "C17",
    guide: "Mrs. Vinitta Sunish",
    title: "AI-Driven Carbon Footprint Tracker and Reduction Assistant",
    students: [
      { rollNo: 29, name: "Sanskar Suryawanshi" },
      { rollNo: 13, name: "Manav Singh" },
      { rollNo: 11, name: "Kesar Singh" },
    ],
  },
  {
    groupId: "C18",
    guide: "Ms. Tanmayi N",
    title: "AI powered interview cheating detection system",
    students: [
      { rollNo: 10, name: "Ashmit Singh" },
      { rollNo: 21, name: "Sumit Singh" },
      { rollNo: 19, name: "Shivam Singh" },
    ],
  },
  {
    groupId: "C19",
    guide: "Mrs. Vinitta Sunish",
    title:
      "An AI-powered virtual Chartered accountant for automated financial analysis, text generation and compliance guidance",
    students: [
      { rollNo: 58, name: "Ritesh Yadav" },
      { rollNo: 55, name: "Rajkumar Yadav" },
      { rollNo: 56, name: "Ramkisan Yadav" },
    ],
  },
  {
    groupId: "C20",
    guide: "Dr. R. R. Sedamkar/ Co guide: Ms. Siddhi Ambre",
    title:
      "Blockchain Enabled Intelligent Inventory management System for Retail Chains",
    students: [
      { rollNo: 51, name: "Ankit Yadav" },
      { rollNo: 57, name: "Reetika Yadav" },
      { rollNo: 18, name: "Rishabh Singh" },
    ],
  },
  {
    groupId: "C21",
    guide: "Ms. Pratiksha D",
    title: "Fake News Detection Using Hybrid ML Models",
    students: [
      { rollNo: 47, name: "Manthan Vishwakarma" },
      { rollNo: 59, name: "Rupesh Yadav" },
      { rollNo: 64, name: "Yashwanth Pedapolu" },
    ],
  },
  {
    groupId: "C22",
    guide: "Ms. Drashti S",
    title: "Dynamic Route Rationalization using real time data",
    students: [
      { rollNo: 32, name: "Tanmay Shinde" },
      { rollNo: 5, name: "Krish Shetty" },
      { rollNo: 48, name: "Parth Vishwakarma" },
    ],
  },
  {
    groupId: "C23",
    guide: "Ms. Drashti S",
    title:
      "A modular architecture for reducing and monitoring computational Carbon footprint of AI",
    students: [
      { rollNo: 12, name: "Lakshyajeet Singh" },
      { rollNo: 1, name: "Seher Sharik" },
      { rollNo: 8, name: "Aditi Singh" },
    ],
  },
  {
    groupId: "C24",
    guide: "Mrs.Lydia Suganya",
    title:
      "DevSpace: A domain-aware Intelligent social platform for developer centric knowledge sharing",
    students: [
      { rollNo: 53, name: "Anushka Yadav" },
      { rollNo: 63, name: "Vishal Yadav" },
      { rollNo: 65, name: "Jaitej Singh" },
    ],
  },
];

export default function ProjectTable() {
  const [scrollY, setScrollY] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats calculation
  const teACount = rblGroups.filter((g) => g.groupId.startsWith("A")).length;
  const teBCount = rblGroups.filter((g) => g.groupId.startsWith("B")).length;
  const teCCount = rblGroups.filter((g) => g.groupId.startsWith("C")).length;
  const totalCount = rblGroups.length;

  // Filter logic
  const filteredGroups = React.useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return rblGroups.filter((group) => {
      const matchesSearch =
        group.title.toLowerCase().includes(searchLower) ||
        group.guide.toLowerCase().includes(searchLower) ||
        group.students.some((s) => s.name.toLowerCase().includes(searchLower));

      const matchesFilter =
        !selectedGroup || group.groupId.startsWith(selectedGroup);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedGroup]);
  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-black overflow-hidden">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* ===== LOGO ===== */}
      <div className="absolute top-6 left-6 z-40">
        <div className="bg-white dark:bg-slate-950 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 w-fit backdrop-blur-xl">
          <Image
            src="/tcetlogo.png"
            alt="TCET Logo"
            width={64}
            height={64}
            unoptimized
            className="object-contain w-10 h-10 md:w-12 md:h-12"
          />
        </div>
      </div>

      {/* ===== NAVIGATION & THEME ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto">
            <FloatingPillNavbar />
          </div>
        </div>
      </div>
      <ThemeToggle />

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative w-full max-w-7xl mx-auto px-6 pb-12 pt-32 space-y-16 text-zinc-800 dark:text-white font-sans">
        
        {/* ===== HERO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-white/5 backdrop-blur-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">A.Y. 2025-26 | TE RBL Projects</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Project <br /> Allocations
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Discover all T.E. RBL project groups, student assignments, and mentors from TCET. Complete dataset with advanced filtering and search capabilities.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 pt-6">
            {[
              { label: "Total Projects", value: totalCount, color: "from-blue-500 to-cyan-500" },
              { label: "TE-A Groups", value: teACount, color: "from-purple-500 to-pink-500" },
              { label: "TE-B Groups", value: teBCount, color: "from-orange-500 to-red-500" },
              { label: "TE-C Groups", value: teCCount, color: "from-green-500 to-emerald-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-gradient-to-br ${stat.color} p-0.5 rounded-xl cursor-default`}
              >
                <div className="bg-white dark:bg-black p-3 sm:p-4 rounded-xl space-y-2 group-hover:shadow-lg transition-all duration-300">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== SEARCH & FILTER SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[1fr_200px] gap-3 sm:gap-4">
            {/* SEARCH BOX */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects, guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* FILTER DROPDOWN */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
              <div className="relative">
                <select
                  value={selectedGroup || ""}
                  onChange={(e) => setSelectedGroup(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-900 dark:text-white font-medium outline-none appearance-none cursor-pointer transition"
                >
                  <option value="">All Groups</option>
                  <option value="A">TE-A</option>
                  <option value="B">TE-B</option>
                  <option value="C">TE-C</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          {/* RESULTS COUNT */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Showing <span className="text-blue-600 dark:text-cyan-400 font-bold">{filteredGroups.length}</span> of <span className="font-bold">{totalCount}</span> projects
          </p>
        </motion.div>

        {/* ===== TABLE SECTION WITH SCROLL EFFECTS ===== */}
        <motion.div
          style={{
            scale: 0.95 + scrollY / 3000,
            opacity: Math.max(0.5, 1 - scrollY / 1500),
          }}
          className="origin-top"
        >
          <div className="relative group">
            {/* GLOW EFFECT */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500 -z-10"></div>

            {/* TABLE WRAPPER */}
            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] rounded-2xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-2xl">
              <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 border-b-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold sticky top-0 z-20 shadow-md">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 13h2v8H3z M17 3h2v18h-2z M10 8h2v13h-2z" />
                        </svg>
                        <span className="hidden sm:inline">Group</span>
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span className="hidden sm:inline">Roll No</span>
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="hidden sm:inline">Name</span>
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left min-w-[200px] sm:min-w-[280px] md:min-w-[350px]">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.71v2.17h-5.04v-2.71l2.75-3.54h-2.71V9.02h5.04v2.27z" />
                        </svg>
                        <span className="hidden sm:inline">Project</span>
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="hidden sm:inline">Guide</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="divide-y divide-gray-300 dark:divide-gray-700"
                >
                  {filteredGroups.map((group, groupIndex) => (
                    <React.Fragment key={group.groupId}>
                      {group.students.map((student, studentIndex) => (
                        <motion.tr
                          key={`${group.groupId}-${student.rollNo}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: (studentIndex % 5) * 0.05 }}
                          viewport={{ once: true, margin: "-100px" }}
                          className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500"
                        >
                          {/* 1. Group No (Grouped) */}
                          {studentIndex === 0 && (
                            <td
                              className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 font-bold text-gray-900 dark:text-white align-top rounded-tl-lg group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors"
                              rowSpan={group.students.length}
                            >
                              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm">
                                {group.groupId}
                              </span>
                            </td>
                          )}

                          {/* 2. Roll No (Individual) */}
                          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-700 dark:text-gray-400 font-mono text-xs sm:text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                            {student.rollNo}
                          </td>

                          {/* 3. Student Name (Individual) */}
                          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-800 dark:text-gray-300 font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs sm:text-sm">
                            {student.name}
                          </td>

                          {/* 4. Project Title (Grouped) */}
                          {studentIndex === 0 && (
                            <td
                              className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 align-top whitespace-normal text-gray-700 dark:text-gray-300 font-semibold leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs sm:text-sm"
                              rowSpan={group.students.length}
                            >
                              {group.title}
                            </td>
                          )}

                          {/* 5. Guide Name (Grouped) */}
                          {studentIndex === 0 && (
                            <td
                              className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 align-top whitespace-normal text-gray-700 dark:text-gray-400 text-xs sm:text-sm group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors"
                              rowSpan={group.students.length}
                            >
                              {group.guide}
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </React.Fragment>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ===== EMPTY STATE ===== */}
        {filteredGroups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 space-y-4 px-4"
          >
            <svg className="w-16 sm:w-20 h-16 sm:h-20 mx-auto text-gray-400 dark:text-gray-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">No projects found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGroup(null);
              }}
              className="inline-flex items-center gap-2 mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm sm:text-base rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
