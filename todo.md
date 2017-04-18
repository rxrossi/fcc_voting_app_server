#TODO

	- Auth system
	-- write a test to ensure that user needs to be authenticated to edit a user
	-- write a test that ensures that user can only edit itself

	- Votations
	-- user needs to be authenticated to create a voting
	-- user can edit, or delete a voting
	-- user can get a list of his votings

	- Unauthenticated and authenticated users can see all the votings
	-- they can also vote or create new options for votings

	## Routes
		/users
		/auth
			POST route send a token to the user

		/votings/:id
			GET see a voting
			POST send a vote 
			user can't edit or delete a voting after its released

		/votings/:id/newOpt	
			POST create a new opt
			cant PUT, DELETE OR GET
			
