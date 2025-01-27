import { useEffect, useState } from "react";
import axios from "axios"

function MemoryGame() {
    const [pokemons, setPokemons] = useState([]);
    const [clickedPokemons, setClickedPokemons] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=21");
                const results = response.data.results;
                
                const detailedPokemon = await Promise.all(
                    results.map(async (pokemon) => {
                        const detail = await axios.get(pokemon.url);
                        return {
                            name: pokemon.name,
                            image: detail.data.sprites.front_default,
                        };
                    })
                );

                    setPokemons(detailedPokemon);
                } catch (error) {
                    console.log("Error occured while fetching data:", error);
                }
            };
            fetchData();
    }, []);

    const shuflePokemons = (pokemonsArray) => {
        return pokemonsArray
        .map((pokemon) => ({ ...pokemon, random: Math.random() }))
        .sort((a, b) => a.random - b.random)
        .map(({ random, ...pokemon }) => pokemon);
    };

    const handleCardClick = (name) => {
        if (clickedPokemons.includes(name)) {
            // alert("Oops you've clicked it before! gg");
            setScore(0);
            setClickedPokemons([]);
        } else {
            setClickedPokemons([...clickedPokemons, name]);
            setScore(score + 1)

            if (score + 1 > highScore) {
                setHighScore(score + 1);
            }
        }

        setPokemons(shuflePokemons(pokemons));
    };

    return (
        <div className="main" style={{ textAlign: "center"}}>
            <h1>Pokemon Memore Game</h1>
            <h2>Score: {score}</h2>
            <h2>Highest score: {highScore}</h2>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {pokemons.map((pokemon) => (
                    <div 
                    key={pokemon.name}
                    onClick={() => handleCardClick(pokemon.name)}
                    style={{
                        margin: "10px",
                        padding: "10px",
                        border: "1px solid black",
                        borderRadius: "8px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "120px",
                    }}
                >
                    <img
                     src={pokemon.image}
                     alt={pokemon.name}
                     style={{width: "100px", height: "100px"}}
                    />
                    <p>{pokemon.name}</p>
                </div>
                ))}
            </div>
        </div>

    )
    
}

export default MemoryGame;