package com.felix.bms.security;

import com.felix.bms.exception.TokenMissingException;
import com.felix.bms.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
 import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;
    private final HandlerExceptionResolver resolver;
    private final  RequestMatcher permitAllMatcher;

    @Autowired
    public JwtAuthenticationFilter(UserDetailsServiceImpl userDetailsService, JwtService jwtService, @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver, RequestMatcher permitAllMatcher)  {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.resolver = resolver;
        this.permitAllMatcher = permitAllMatcher;
    }



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (permitAllMatcher.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

         if(authHeader == null || !authHeader.startsWith("Bearer")){
             resolver.resolveException(
                     request,
                     response,
                     null,
                     new TokenMissingException("Required token for process request") // or better: custom exception
             );
             return;
         }


        jwt=authHeader.substring(7); // remove "Bearer "
        log.debug(jwt + " token catch");

        try{

            userEmail=jwtService.extractUsername(jwt);
            if(userEmail !=null && SecurityContextHolder.getContext().getAuthentication()==null){
                UserDetails userDetails=userDetailsService.loadUserByUsername(userEmail);

                if(jwtService.isTokenValid(jwt,userDetails)){
                    log.info("token is valid");
                    UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated User : {}", userEmail);
                }
            }
        }catch (Exception e){
            log.error("JWT processing failed : {}", e.getMessage());
            resolver.resolveException(request, response, null, e);
            return;
        }


            filterChain.doFilter(request, response); // only if authenticated or public

    }


}
