//package com.nbu.medicalreport.security;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//public class KeyCloakAuthorityConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
//
//    @Override
//    public Collection<GrantedAuthority> convert(Jwt source) {
//        Map<String, Object> realm = (Map<String, Object>) source.getClaims().get("realm_access");
//        if (realm == null || realm.isEmpty()) {
//            return new ArrayList<>();
//        }
//
//        Collection<GrantedAuthority> authorities = ((List<String>) realm.get("roles"))
//                .stream()
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());
//
//        return authorities;
//    }
//}
