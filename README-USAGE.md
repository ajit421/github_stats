# Add to Your GitHub Profile

Replace `YOUR-USERNAME` with your GitHub username.
Replace `YOUR-DEPLOYMENT-URL` with your Vercel URL (e.g., `https://github-stats-api.vercel.app`).

## Basic Stats
![GitHub Stats](https://YOUR-DEPLOYMENT-URL/api/stats?username=YOUR-USERNAME&theme=tokyonight&hide_border=true)

```markdown
![GitHub Stats](https://YOUR-DEPLOYMENT-URL/api/stats?username=YOUR-USERNAME&theme=tokyonight&hide_border=true)
```

## Streak Stats
![GitHub Streak](https://YOUR-DEPLOYMENT-URL/api/streak?username=YOUR-USERNAME&theme=tokyonight&hide_border=true)

```markdown
![GitHub Streak](https://YOUR-DEPLOYMENT-URL/api/streak?username=YOUR-USERNAME&theme=tokyonight&hide_border=true)
```

## Top Languages
![Top Languages](https://YOUR-DEPLOYMENT-URL/api/top-langs?username=YOUR-USERNAME&layout=compact&theme=tokyonight&hide_border=true)

```markdown
![Top Languages](https://YOUR-DEPLOYMENT-URL/api/top-langs?username=YOUR-USERNAME&layout=compact&theme=tokyonight&hide_border=true)
```

## Commit Activity
![Commit Activity](https://YOUR-DEPLOYMENT-URL/api/commit-activity?username=YOUR-USERNAME&theme=tokyonight)

```markdown
![Commit Activity](https://YOUR-DEPLOYMENT-URL/api/commit-activity?username=YOUR-USERNAME&theme=tokyonight)
```

## Available Themes
- `default`
- `dark`
- `tokyonight`
- `radical`

## Centered Layout Example
```html
<div align="center">
  <img src="https://YOUR-DEPLOYMENT-URL/api/stats?username=YOUR-USERNAME&theme=tokyonight&hide_border=true" height="195" />
  <img src="https://YOUR-DEPLOYMENT-URL/api/streak?username=YOUR-USERNAME&theme=tokyonight&hide_border=true" height="195" />
  <br/>
  <img src="https://YOUR-DEPLOYMENT-URL/api/top-langs?username=YOUR-USERNAME&theme=tokyonight&layout=compact&hide_border=true" height="195" />
  <img src="https://YOUR-DEPLOYMENT-URL/api/commit-activity?username=YOUR-USERNAME&theme=tokyonight" height="195" />
</div>
```
