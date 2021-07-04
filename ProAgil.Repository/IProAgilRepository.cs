using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //Geral
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         Task<bool> SaveChangesAsync();

         Task<Evento[]> getAllEventosAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> getAllEventosAsync(bool includePalestrantes);
         Task<Evento> getEventoAsyncById(int EventoId,bool includePalestrantes);



         Task<Palestrante[]> getAllPalestrantesAsync(bool includeEventos);
         Task<Palestrante> getPalestranteAsyncById(int PalestranteId,bool includeEventos);

         Task<Palestrante[]> getAllPalestrantesAsyncByName(string name,bool includeEventos);
    }
}