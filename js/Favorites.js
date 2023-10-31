import { GithubUser } from "./GithubUser.js"


// class que vai conter a logica dos dados
// como os dados serao estruturados
export class Favorites {
  constructor(root) { // a root, chama a div app, nesse caso e uma entrada um comando em JS
    this.root = document.querySelector(root) // aqui do a fucao de procura o root, no caso a div #app
    this.load()
  }

  // carregamentos dos dados
  load() {
    this.entries = JSON.parse(localStorage.getItem('github-favorites:')) || []
     
  }

  // aqui salva a lista
  save() {
    // ele tranforma um objeto em string, pega todos os objetos e tranforma em uma string para salvar nesse localstorage
    localStorage.setItem('github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    // podemos fazer uma tentativa, try quer diser tente
    try {

        // aqui faco para nao add duas vezes, find e encontre, se ele encontra vai retorna verdadeiro ai ele pega essa entrada e retorna como um objeto. entry.login === username aqui ele faz se o usuario exite
        const userExists = this.entries.find(entry => entry.login === username)

       // se o user existir SpeechRecognitionResult, nesse caso para mas ai vou fazer uma menssagem
        if(userExists) {
          throw new Error('usuario ja cadastrado')
        }



      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuario nao encontrado')
      }
      // aqui ele colocar em primeiro o usuario cadastrado e depois, [user, ...this.entries] com isso ele vai espalhando o resto na lista depois desse que vc colocou, assim sempre o que add e o primeiro
        this.entries = [user, ...this.entries]
        // ele sempre vai rescrever e colocar tudo na lista
        this.update()
        // depois de add ele salva
        this.save()

      // aqui ele capture, catch e capture
    } catch(error) {
        alert(error.message)
    }
    
  }

  // aqui faco assim, quando ele for deletado, que eu abri o site e ele tive sido deletado, ele olhar aqui se tive nao mostra, o usuario ele compara se e igual se nao for ele deletada esse usuario
  delete(user) {
    // aqui eu filtro o elemento ou usuario, ou seja me der todos os usuarios que vou passar ali dentro todo os usuarios que esta la na lista, execetor a que vou passa aqui no filter
    // nesse caso se for diferente, entry.login for diferente user.login mantei na minha lista, e se nao for diferente, nesse caso igual ele vai retira da lista
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
      // estou apagando todo arrey nesse caso a lista, e colocando um novo entao quando eu aperta o x ele vai sumir.
      this.entries = filteredEntries
      this.update() // quando faco update ele somi na aplicacao, com a lista nao o usuario
      // aqui quando eu deletar e atualizar a pagina ele nao volta para lista se nao fizer ele volta
      this.save()
  }

}


// class que vai criar visualizacao e evento do HTML
// atraves do extends agente unir as duas class, aqui faz colar a lista da pagina fonte com a minha pagina
// quando faco FavoritesView(faz a visualizacao na api, costruir a visualizacao na pagina fonte) puxo tudo que tem em root com extends com extends
export class FavoritesView extends Favorites { 
  // aqui faco um link criando a integracao das duas pagina aqui realmente faz a uniao das duas class, na pagina fonte e na pagina do meu site
  constructor(root) {
    super(root) 

    this.tbody = this.root.querySelector('table tbody')


    this.update()
    this.onadd()
  }
    // aqui crio o evento de clicar no botao e achar o usuario no github
    onadd() {
      const addButton = this.root.querySelector('.search button') // aqui ele acha o button no html
      // quando esse butao receber um click, 
      addButton.onclick = () => {
        // aqui pego o valor dentor do input, nesse input pego so o value tem outras coisas mas so pego isso
        const { value } = this.root.querySelector('.search input')
        this.add(value)
      }
    }



   // toda vez que for add um dado ou remover um dado na aplicacoa entre as paginas as fucoes seraoa qui
   update() {
    this.removeAllTr(); // aqui chamo a função para remover os elementos
    // aqui a createRow foi colocada aqui na row, nessa row
    this.entries.forEach(user => {
      const row = this.createRow()
      // aqui a row faz a pesquisa para troca imagem
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      // aqui mudar o nome da imagem quando nao for carregada a imagem
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      // aqui quando clico, me direcionar para pagina github no login da pessoa
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      // mudar os nomes, que estao em <p>
      row.querySelector('.user p').textContent = user.name
      // mudar o login o nome do usuario no github
      row.querySelector('.user span').textContent = user.login

      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      // aqui ele remove da lista quando aperta o X, se vc for usar outro momento esse X em outro canto da pagina, vc deve troca onclick por addEventelist
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuario?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row);
    
    })
  }
  
  // aqui ela vai para row acima
  createRow() {
    // criando as linhas pela DOM
    const tr = document.createElement('tr')

    // aqui esta o conteudo da tr, com tr.innerHTML coloco o HTML dentro do tr
    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/thiagotsdelima.png" alt="Imagem de thiago ticiano">
          <a href="https://github.com/thiagotsdelima" target="_blank"> <!--target="_blank" e para que abra em outra janela-->
            <p>Thiago Sombra</p>
            <span>thiagotsdelima</span>
          </a>
        </td>
        <td class="repositories">
          76
        </td>
        <td class="followers">
          9589
        </td>
        <td>
          <button class="remove">&times;</button>
        </td>
    `
    // quando faco o return, pois estou deixando a fucao para fucionar com a lista em todo, ela e usada para todos os usuarios
    return tr
    
  }

  // fucao de remover a lista da tabela do meu site
  removeAllTr() {
    // quando entra dentro da tabela acima. aqui, vamos da o comandor para pegar todas as linhas, todos os elementos dentro dele
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove() // aqui sempre que abri a pagina ele remove os elementos da tablea
    }); // tr quer diser linhas no html, faco forEach para cada linha da tabela
  }
}


