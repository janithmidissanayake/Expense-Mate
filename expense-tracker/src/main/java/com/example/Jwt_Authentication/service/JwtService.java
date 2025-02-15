package com.example.Jwt_Authentication.service;

import com.example.Jwt_Authentication.model.User;
import com.example.Jwt_Authentication.repository.TokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final TokenRepository tokenRepository;
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);

    }



    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {

        if (userDetails instanceof User) {
            User user = (User) userDetails;
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "ROLE_" + user.getRole().name()); // Add ROLE_ prefix
            return generateToken(claims, userDetails);
        }
        return null;
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 48)) // 24 hours
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String generateRefreshToken(UserDetails userDetails) {
        long refreshExpiration = System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7; // Example: 7 days
        return Jwts.builder()
                .setClaims(new HashMap<>()) // Add any custom claims if needed
                .setSubject(userDetails.getUsername()) // Set the subject as the username
                .setIssuedAt(new Date(System.currentTimeMillis())) // When the token is issued
                .setExpiration(new Date(refreshExpiration)) // When the token expires
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Use the signing key and algorithm
                .compact(); // Build the token
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = this.extractUsername(token);
        boolean isValidToken = tokenRepository.findByToken(token)
                .map(t -> !t.isRevoked())
                .orElse(false);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }





    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }


    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
