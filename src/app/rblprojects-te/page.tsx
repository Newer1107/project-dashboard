"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        animationFrameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
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
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="absolute top-6 left-6 z-40">
        <div className="bg-white/80 dark:bg-black/80 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-fit backdrop-blur-xl">
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

      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto">
            <FloatingPillNavbar />
          </div>
        </div>
      </div>

      <ThemeToggle />

      <div className="relative w-full max-w-7xl mx-auto px-6 pb-12 pt-32 space-y-12 text-neutral-800 dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              RBL Projects <br />
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Explore TE RBL projects from TCET with student allocation details,
              project titles, and assigned guides.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300 -z-10"></div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl focus-within:border-emerald-500 transition-colors">
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search projects, guides, or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>

          <select
            value={selectedGroup || ""}
            onChange={(e) => setSelectedGroup(e.target.value || null)}
            className="px-4 py-3 w-full md:w-48 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="">All Groups</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>
        </motion.div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
          Showing <span className="font-bold">{filteredGroups.length}</span> of{" "}
          <span className="font-bold">{totalCount}</span> projects
        </p>

        <motion.div
          style={{
            scale: Math.min(1, 0.95 + scrollY / 3000),
            opacity: Math.max(0.5, 1 - scrollY / 1500),
          }}
          className="origin-top"
        >
          <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
            <div className="w-full overflow-x-auto max-h-[70vh]">
              <table
                className="w-full text-left text-sm"
                style={{ minWidth: "800px" }}
              >
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-24">Group</th>
                    <th className="px-4 py-4 font-semibold w-72">Project</th>
                    <th className="px-4 py-4 font-semibold w-56">Students</th>
                    <th className="px-4 py-4 font-semibold w-48">Guide</th>
                  </tr>
                </thead>

                <AnimatePresence>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group, idx) => (
                        <motion.tr
                          key={group.groupId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
                        >
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold">
                              {group.groupId}
                            </span>
                          </td>

                          <td className="px-4 py-4 align-top">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                              {group.title}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-top">
                            <ul className="space-y-1">
                              {group.students.map((student) => (
                                <li
                                  key={`${group.groupId}-${student.rollNo}`}
                                  className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
                                >
                                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                                    {student.rollNo}
                                  </span>
                                  <span className="font-medium group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-200 transition-colors">
                                    {student.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
                            {group.guide}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <span className="text-4xl">📭</span>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                              No matches found
                            </h3>
                            <p className="text-sm text-neutral-500">
                              Try adjusting your search criteria.
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedGroup(null);
                              }}
                              className="mt-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-80 transition"
                            >
                              Reset Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
