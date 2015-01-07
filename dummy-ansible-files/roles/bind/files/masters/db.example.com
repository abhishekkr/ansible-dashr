$TTL    4h
$ORIGIN example.com.
@           IN      SOA     ns1.example.com.    hostmaster.example.com. (
                            2013092801    ; Serial
                            1d            ; slave refresh (1 day)
                            2h            ; slave retry time in case of a problem (2 hours)
                            2w            ; slave expiration time (2 weeks)
                            2d            ; minimum caching time in case of failed lookups (2 days)
                            )
            IN      NS      ns1.example.com.
www         IN      A       127.0.0.1
