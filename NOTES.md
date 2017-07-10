After cloning, create config file on the root, not on src folder.
The expected content for this file is something like this:

```
	export default {
		jwtSecret: 'str'
	}
```

TODO: not passing email and password for post auth route crashes the application (ex.: passing only email)
