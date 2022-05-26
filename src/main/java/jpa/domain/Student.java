package jpa.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "student")
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Predmeti> predmetis = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Student name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Predmeti> getPredmetis() {
        return this.predmetis;
    }

    public void setPredmetis(Set<Predmeti> predmetis) {
        if (this.predmetis != null) {
            this.predmetis.forEach(i -> i.setStudent(null));
        }
        if (predmetis != null) {
            predmetis.forEach(i -> i.setStudent(this));
        }
        this.predmetis = predmetis;
    }

    public Student predmetis(Set<Predmeti> predmetis) {
        this.setPredmetis(predmetis);
        return this;
    }

    public Student addPredmeti(Predmeti predmeti) {
        this.predmetis.add(predmeti);
        predmeti.setStudent(this);
        return this;
    }

    public Student removePredmeti(Predmeti predmeti) {
        this.predmetis.remove(predmeti);
        predmeti.setStudent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return id != null && id.equals(((Student) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
