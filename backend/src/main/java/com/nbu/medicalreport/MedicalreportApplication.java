package com.nbu.medicalreport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MedicalreportApplication {



	public static void main(String[] args) {

		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String rawPassword = "admin";
		System.out.println("Encoded password: " + passwordEncoder.encode(rawPassword));

		SpringApplication.run(MedicalreportApplication.class, args);
	}

}
