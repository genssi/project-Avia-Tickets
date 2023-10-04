class Favorites {
  constructor() {
    this.favoriteTickets = [];
  }

  // Добавить билет в избранное
  addTicket(ticket) {
    this.favoriteTickets.push(ticket);
  }

  // Удалить билет из избранного
  removeTicket(ticket) {
    const index = this.favoriteTickets.findIndex(
      (favTicket) => favTicket.id === ticket.id
    );
    if (index !== -1) {
      this.favoriteTickets.splice(index, 1);
    }
  }

  // Получить все избранные билеты
  getAllTickets() {
    return this.favoriteTickets;
  }
}

// Создаем экземпляр класса Favorites
const favorites = new Favorites();

export default favorites;
