package jpa.domain;

import static org.assertj.core.api.Assertions.assertThat;

import jpa.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PredmetiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Predmeti.class);
        Predmeti predmeti1 = new Predmeti();
        predmeti1.setId(1L);
        Predmeti predmeti2 = new Predmeti();
        predmeti2.setId(predmeti1.getId());
        assertThat(predmeti1).isEqualTo(predmeti2);
        predmeti2.setId(2L);
        assertThat(predmeti1).isNotEqualTo(predmeti2);
        predmeti1.setId(null);
        assertThat(predmeti1).isNotEqualTo(predmeti2);
    }
}
