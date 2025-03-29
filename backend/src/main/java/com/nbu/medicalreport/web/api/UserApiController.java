package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.UpdateUserDTO;
import com.nbu.medicalreport.dto.UserDTO;

import com.nbu.medicalreport.service.UserService;
import com.nbu.medicalreport.dto.CreateUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    @GetMapping("/list")
    public List<UserDTO> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable long id) {
        return this.userService.getUserById(id);
    }

    @PostMapping
    public CreateUserDTO createUser(@RequestBody CreateUserDTO createUserDTO) {
        return this.userService.createUser(createUserDTO);
    }

    @PutMapping("/{id}")
    public UpdateUserDTO updateUser(@PathVariable long id, @RequestBody UpdateUserDTO updateUserDTO) {
        return this.userService.updateUser(id, updateUserDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable long id) {
        this.userService.deleteUser(id);
    }

}
