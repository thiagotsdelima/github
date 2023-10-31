export class GithubUser {
  // aqui pego o api do site e tiro so o que eu quero, ele vai busca la no endpoint = `https://api.github.com/users/${username}` todos os dados que tem lar, aqui recebor o retorno d busca then(data => data.json()) ele me dar um jason aqui pego o que eu quero, desistruturo e targo isso .then(({login, name, public_repos, followers}) entao o fetch vai retorna o objeto, login, name e etc.
  static search(username) {
    // local que vou chega com a  aplicacoa
    const endpoint = `https://api.github.com/users/${username}`
    // fetch e quem vai busca os dados na minha pagina fonte, ele tbm e uma promessar, nesse caso ele pega o dado, e tranforma em JASON
    return fetch(endpoint).then(data => data.json())
    // aqui ele pega esse memso dado, JASON e tranforma em objeto, faco ({}))(grupo operention), se fosse so assim, {}) teria que contruir todo o obejto entao vc faz a arefucth e retorna direto um obejto
    .then(({login, name, public_repos, followers}) => ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}
