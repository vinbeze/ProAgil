using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class RedeSocialDto
    {

        public int id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O campo {0} é Obrigatório")]
        public string URL { get; set; }

    }
}