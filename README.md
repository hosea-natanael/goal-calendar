A goal calendar in web app format made with React JS, React Router, TailwindCSS and React Calendar. This project goal is to show my skill in reactivity on a common web app flow.

The project is divided in two folders `fe` and `server`. Please mainly refer to the `fe` folder as the `server` folder was more of an **ad-hoc** solution for an API back end.

# Demo
You can check out the application running live on my personal server from this link: [goal calendar](https://goal-calendar.hosean.my.id).

# Run
Be sure to have docker and docker compose on you local machine. [install](https://docs.docker.com/compose/install/)

The front end file (`fe`) uses enviromental file. Do copy the `.env.example` to a `.env` in the `fe` folder.

Start docker compose and let it run for a couple minutes.

```bash
docker compose up -d
```

Open [http://localhost:3001](http://localhost:3001) in your browser and register an account to login and finally use the app.