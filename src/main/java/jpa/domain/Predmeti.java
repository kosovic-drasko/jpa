package jpa.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Predmeti.
 */
@Entity
@Table(name = "predmeti")
@NamedNativeQuery(
    name = "Predmeti.getPredmeti",
    query = "select predmeti.id,predmeti.naziv_predmeta," +
    "predmeti.broj_semestara,predmeti.student_id,predmeti.broj_semestara*10" +
    " as ukupno_semestara from predmeti",
    resultClass = Predmeti.class
)
public class Predmeti implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "naziv_predmeta")
    private String nazivPredmeta;

    @Column(name = "broj_semestara")
    private Integer brojSemestara;

    @Column(name = "ukupno_semestara")
    private Integer ukupnoSemestara;

    @ManyToOne
    @JsonIgnoreProperties(value = { "predmetis" }, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getUkupnoSemestara() {
        return ukupnoSemestara;
    }

    public Long getId() {
        return this.id;
    }

    public Predmeti id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazivPredmeta() {
        return this.nazivPredmeta;
    }

    public Predmeti nazivPredmeta(String nazivPredmeta) {
        this.setNazivPredmeta(nazivPredmeta);
        return this;
    }

    public void setNazivPredmeta(String nazivPredmeta) {
        this.nazivPredmeta = nazivPredmeta;
    }

    public Integer getBrojSemestara() {
        return this.brojSemestara;
    }

    public Predmeti brojSemestara(Integer brojSemestara) {
        this.setBrojSemestara(brojSemestara);
        return this;
    }

    public void setBrojSemestara(Integer brojSemestara) {
        this.brojSemestara = brojSemestara;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Predmeti student(Student student) {
        this.setStudent(student);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Predmeti)) {
            return false;
        }
        return id != null && id.equals(((Predmeti) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Predmeti{" +
            "id=" + getId() +
            ", nazivPredmeta='" + getNazivPredmeta() + "'" +
            ", brojSemestara=" + getBrojSemestara() +
            "}";
    }
}
