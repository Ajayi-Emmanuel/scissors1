function Random(){
    const MAX = 36;

    let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9']
    let res = ''
    for (let i =0; i < 10; i++){
        res += alphabet[(Math.floor(Math.random() * 10) % MAX)]
    }
    return res;
}

module.exports = Random