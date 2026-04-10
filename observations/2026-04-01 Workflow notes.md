Workflow issues

1. TD sessions fighting with each other? Is there a single focused issue?
	1. got rid of TD
2. Fixed worktrees are hard to keep track of -- what's happening where. 
3. From "looks good" to "done" takes a while, requires babysitting and again keeping track of the pieces -- pr, review, address comments. 
	1. added check-ci skill
4. Manual high-level dependency tracking -- I'm fiddling with this page over there, so don't start something over here.
5. claude doesn't have access to browser dom tools. Look at the VS code built-in browser.
	1. doesn't seem to work with claude, only their built-in agents
6. Idea to try:
    - worktree per feature/task/etc, deleted when done
	    - working well
    - gets it's own vs code window, with browser and claude session
	    - also working pretty well
    - figure out how to use td with multiple parallel workstreams
        - not working well. Let's skip that for now. Just make a script.

