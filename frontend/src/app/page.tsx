"use client"

const Home = () => {
    async function handleTest() {
        try {
            const res = await fetch("http://localhost:4000/");
            const data = await res.text();
            console.log(data);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <p className="text-purple-500">hello</p>
            <button onClick={handleTest}>test</button>
        </>
    )
}

export default Home;
