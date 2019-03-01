# MMM-openaq
A MagicMirror module that displays Air Quality measurement from OpenAQ.org

# Configuration
In your module in config.js, add :
```
{
        module: "MMM-openaq",
        header: "Qualité de l'air :",
        position: "top_right",  // position
        disabled: false,
        config: {
                station: 'FR11025', 
		label: 'Lille Fives' 
        }
},
```
